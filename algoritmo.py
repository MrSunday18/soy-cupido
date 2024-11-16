import pandas as pd
import json

perfiles = None 
# Suponiendo que tienes un archivo CSV con perfiles de usuarios
def cargar_perfiles():
    global perfiles
    if perfiles is None:
        from app import cargar_usuarios
        perfiles = cargar_usuarios()  # O la función correspondiente que ya hayas definido
    else:
        print("Perfiles ya estaban cargados en memoria.")
    return perfiles

def calculate_match_score(profile1, profile2):
    # Asegurar que Age esté en el formato correcto (int)
    age1 = int(profile1['Age'])
    age2 = int(profile2['Age'])

     # Asegurar que Interests sea una lista antes de convertir a set
    if isinstance(profile1['Interests'], str):
        interests1 = set(eval(profile1['Interests']))
    else:
        interests1 = set(profile1['Interests'])

    if isinstance(profile2['Interests'], str):
        interests2 = set(eval(profile2['Interests']))
    else:
        interests2 = set(profile2['Interests'])
    shared_interests = interests1.intersection(interests2)
    shared_interests_score = min(3, 0.3 * len(shared_interests))

    # Age difference score (higher age difference, lower score)
    age_difference = abs(age1 - age2)
    age_difference_score = max(0, 2 - age_difference / 5)  # Decrementa menos rápidamente

    # Swiping history score (higher swiping history, higher score)
    swiping_history_score = min(2, 0.02 * min(profile1['Swiping History'], profile2['Swiping History']))

    # Relationship type score (1 point for matching types)
    relationship_type_score = 1 if profile1['Looking For'] == profile2['Looking For'] else 0

    child_type_score = 1 if profile1['Children'] == profile2['Children'] else 0
    
    # Total match score
    total_score = round(
        (shared_interests_score + age_difference_score + swiping_history_score +
        relationship_type_score + child_type_score),2
    )

    # Build explanation
    explanation = (
        f"Este perfil es recomendable para ti debido a que: "
        f"Tienes {len(shared_interests)} intereses en común que son:  {', '.join(shared_interests)} ||  "
        f"Tu diferencia de edad es {age_difference} años || "
        f"Puntuación en la app: {swiping_history_score:.2f} || "
        f"Buscais el mismo tipo de relación:  {'Si' if relationship_type_score else 'No'}; || "
        f"Buscais tener hijos:  {'Si' if child_type_score else 'No'} || "
        f"Puntuación Total: {total_score:.2f}."
    )

    return total_score, explanation




def encontrar_perfil(perfil_id, data):
    if data is None:
        return json.dumps({'error': 'Dataset no encontrado'})
    
    # Asegurarse de que perfil_id sea un entero
    try:
        perfil_id = int(perfil_id)
    except ValueError:
        return json.dumps({'error': 'ID de perfil inválido'})
    
    try:
        
        perfil_principal = data[data['UserID'] == perfil_id]
        
        # Convertir el DataFrame a formato serializable si no está vacío
        if not perfil_principal.empty:
            perfil_principal = perfil_principal.to_dict(orient='records')[0]  # Convertir a diccionario
        else:
            return json.dumps({'error': 'Perfil no encontrado'})
        
    except Exception as e:  # Capturar cualquier otro error
        return json.dumps({'error': str(e)})
    
    return json.dumps(perfil_principal)  # Ya es un diccionario, se puede serializar directamente

def encontrar_coincidencias(perfil_id, data):
    if data is None:
        return {'error': 'Dataset no encontrado'}

    try:
        perfil_principal = data[data['UserID'] == int(perfil_id)]
        if perfil_principal.empty:
            return {'error': 'Perfil no encontrado'}
        perfil_principal = perfil_principal.iloc[0]
    except Exception as e:
        return {'error': 'Error buscando el perfil: ' + str(e)}
    
    coincidencias = []
    for _, perfil_potencial in data.iterrows():
        if perfil_principal['UserID'] != perfil_potencial['UserID']:
            puntaje, explicacion = calculate_match_score(perfil_principal, perfil_potencial)
            coincidencias.append({
                'perfil_id': perfil_potencial['UserID'],
                'puntaje': puntaje,
                'Motivos': explicacion,
                'Edad' : perfil_potencial['Age'],
                'Sexo' : perfil_potencial['Gender'],
                'Hijos' : perfil_potencial['Children'],
                'Relacion' : perfil_potencial['Looking For']
            })

    # Ordenar las coincidencias de mayor a menor puntaje
    coincidencias_ordenadas = sorted(coincidencias, key=lambda x: x['puntaje'], reverse=True)

    return coincidencias_ordenadas if coincidencias_ordenadas else []  # Asegurarse de devolver una lista



# Prueba de funciones si se ejecuta directamente
if __name__ == "__main__":
    perfiles = cargar_perfiles()
    print(encontrar_coincidencias('id_de_usuario', perfiles))