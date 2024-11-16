import pandas as pd
import hashlib, ast, random, re
from flask import Flask, request, jsonify, session
from flask_cors import CORS 
from algoritmo import encontrar_coincidencias
from translation import translate_to_spanish, feet_to_cm

app = Flask(__name__)
CORS(app)
app.secret_key = "clave_secreta"
PASSWORD_COMUN = "contrasena1234"
usuarios = None
opciones = {}

@app.route('/')
def home():
    return "Bienvenido a Soy Cupido! Ve a /usuarios para ver los usuarios o a /login para iniciar sesión."

def cargar_usuarios():
    global usuarios
    if usuarios is None:
        usuarios = pd.read_csv("dating_app_dataset.csv")
        usuarios['Email'] = usuarios['UserID'].apply(lambda x: f"user{x}@test.es")
        usuarios['Password'] = hashlib.sha256(PASSWORD_COMUN.encode()).hexdigest()
        usuarios['Height'] = usuarios['Height'].apply(lambda x: feet_to_cm(x))
        usuarios['Interests'] = usuarios['Interests'].apply(
            lambda x: translate_to_spanish('Interests', ast.literal_eval(x)) if pd.notna(x) else []
        )
        usuarios['Looking For'] = usuarios['Looking For'].apply(
            lambda x: translate_to_spanish('Looking For', x)
        )
        usuarios['Children'] = usuarios['Children'].apply(
            lambda x: translate_to_spanish('Children', x)
        )
        usuarios['Education Level'] = usuarios['Education Level'].apply(
            lambda x: translate_to_spanish('Education Level', x)
        )
        usuarios['Occupation'] = usuarios['Occupation'].apply(
            lambda x: translate_to_spanish('Occupation', x)
        )
        print(usuarios)
    else:
        print("Usuarios ya estaban cargados en memoria.")
    return usuarios

@app.route('/opciones', methods=['GET'])
def obtener_opciones():
    intereses_unicos = sorted(set([item for sublist in usuarios['Interests'] for item in sublist]))
    buscando_unicos = sorted(usuarios['Looking For'].dropna().unique().tolist())
    hijos_unicos = sorted(usuarios['Children'].dropna().unique().tolist())
    nivel_educacion_unico = sorted(usuarios['Education Level'].dropna().unique().tolist())
    ocupacion_unica = sorted(usuarios['Occupation'].dropna().unique().tolist())

    opciones = {
        'Interests': intereses_unicos,
        'LookingFor': buscando_unicos,
        'Children': hijos_unicos,
        'EducationLevel': nivel_educacion_unico,
        'Occupation': ocupacion_unica
    }
    return jsonify(opciones)


@app.route('/registro', methods=['POST'])
def registro():
    global usuarios
    nuevo_usuario = request.json

    # Asegurarse de que los nombres de las columnas coincidan exactamente
    column_mapping = {
        'LookingFor': 'Looking For',
        'EducationLevel': 'Education Level'
    }
    nuevo_usuario = {column_mapping.get(k, k): v for k, v in nuevo_usuario.items()}

    # Asegurarse de que 'Age' sea un entero
    nuevo_usuario['Age'] = int(nuevo_usuario['Age'])

    # Verificar si el campo 'Height' está presente
    if 'Height' not in nuevo_usuario:
        return jsonify({'error': 'El campo Height es requerido'}), 400

    # Generar un nuevo UserID
    nuevo_usuario['UserID'] = int(usuarios['UserID'].max() + 1) if not usuarios.empty else 1

    # Verificar si el Email y Password están presentes
    if 'Email' not in nuevo_usuario or 'Password' not in nuevo_usuario:
        return jsonify({'error': 'Email y Password son requeridos'}), 400

    nuevo_usuario['Password'] = hashlib.sha256(nuevo_usuario['Password'].encode()).hexdigest()
    # Asignar valores aleatorios para Swiping History y Frequency of Usage
    nuevo_usuario['Swiping History'] = random.randint(0, 99)
    nuevo_usuario['Frequency of Usage'] = random.choice(['Monthly', 'Weekly', 'Daily'])

    # Verificar si el usuario ya existe
    if not usuarios[usuarios['Email'] == nuevo_usuario['Email']].empty:
        return jsonify({'error': 'Usuario ya registrado'}), 400

    # Convertir el nuevo usuario a DataFrame y agregarlo al DataFrame de usuarios
    nuevo_usuario_df = pd.DataFrame([nuevo_usuario])
    usuarios = pd.concat([usuarios, nuevo_usuario_df], ignore_index=True)
    return jsonify({'mensaje': 'Usuario registrado exitosamente', 'userID': int(nuevo_usuario['UserID'])}), 201


@app.route('/perfil/<int:perfil_id>', methods=['GET'])
def obtener_perfil(perfil_id):
    global usuarios
    usuario = usuarios[usuarios['UserID'] == perfil_id]
    
    if usuario.empty:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    perfil = usuario.iloc[0].to_dict()
    print(perfil)
    return jsonify(perfil), 200

@app.route('/perfil/<int:perfil_id>/editar', methods=['PUT'])
def update_profile(perfil_id):
    global usuarios
    update_data = request.json
    
    usuario = usuarios[usuarios['UserID'] == perfil_id]
    
    if usuario.empty:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Campos que realmente queremos actualizar
    campos_actualizables = ['Age', 'Children', 'Education Level', 'Email', 'Frequency of Usage', 'Gender', 'Height', 'Looking For', 'Occupation']

    # Normalizar los valores de los campos antes de actualizar
    for key in campos_actualizables:
        if key in update_data:
            value = update_data[key]
            usuarios.loc[usuarios['UserID'] == perfil_id, key] = value
            print(f'Intentando actualizar {key} a {value} (Tipo de dato: {type(value)})')

    return jsonify({'mensaje': 'Perfil actualizado exitosamente'}), 200






@app.route('/login', methods=['POST'])
def login():
    login_data = request.json

    # Verificación de la estructura del correo electrónico
    if 'email' not in login_data or 'password' not in login_data:
        return jsonify({'error': 'Email y Password son requeridos'}), 400

    # Validación del usuario con el email
    usuario = usuarios[usuarios['Email'] == login_data['email']]

    if usuario.empty:
        print("Error: Usuario no encontrado")
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Validación de la contraseña
    hashed_password = hashlib.sha256(login_data['password'].encode()).hexdigest()
    stored_password = usuario.iloc[0]['Password']

    if hashed_password != stored_password:
        return jsonify({'error': 'Contraseña incorrecta'}), 403

    print("Inicio de sesión exitoso")
    user_id = int(usuario.iloc[0]['UserID'])

    # Almacenar la sesión del usuario
    session['user_id'] = user_id
    session['user_email'] = login_data['email']
    print(session)
    return jsonify({'mensaje': 'Inicio de sesión exitoso', 'userID': user_id}), 200

@app.route('/perfil/<int:perfil_id>/coincidencias')
def calcular_coincidencias(perfil_id):

    if usuarios is None:
        return jsonify({'error': 'Dataset no encontrado'}), 500

    coincidencias = encontrar_coincidencias(perfil_id, usuarios)

    if 'error' in coincidencias:
        return jsonify(coincidencias), 404

    return jsonify(coincidencias)

with app.app_context():
        cargar_usuarios()  # Cargar usuarios al inicio del servidor

if __name__ == '__main__':
    app.run(debug=True)
