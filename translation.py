translation_map = {
    "Male": "Hombre",
    "Female": "Mujer",
    "High School": "Secundaria",
    "Bachelor's Degree": "Licenciatura",
    "Master's Degree": "Máster",
    "Doctorate": "Doctorado",
    "Casual Dating": "Citas casuales",
    "Long-term Relationship": "Relación a largo plazo",
    "Marriage": "Matrimonio",
    "Friendship": "Amistad",
    "Yes": "Sí",
    "No": "No",
    "Maybe": "Tal vez",
    "Sports": "Deportes",
    "Cooking": "Cocina",
    "Hiking": "Senderismo",
    "Music": "Música",
    "Movies": "Cine",
    "Reading": "Lectura",
    "Travel": "Viajar",
    "Artist": "Artista",
    "Business Owner": "Propietario de Negocio",
    "Doctor": "Doctor",
    "Engineer": "Ingeniero",
    "Entrepreneur": "Emprendedor",
    "Social Media Influencer": "Influencer de Redes Sociales",
    "Student": "Estudiante",
    "Teacher": "Profesor",
}

def translate_to_spanish(category, value):
    if isinstance(value, list):
        return [translation_map.get(item, item) for item in value]
    else:
        return translation_map.get(value, value)

def feet_to_cm(feet):
    return round(feet * 30.48, 2)
