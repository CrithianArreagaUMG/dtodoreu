import { Rol } from "./constants";

export interface Usuario {
  id:        string;          // = auth.users.id (UUID de Supabase Auth)
  nombre:    string;
  email:     string;
  foto:      string;
  rol:       Rol;
  estado?:   "pendiente" | "activo" | "revocado";   // aplica a comerciante
  creado_en: string;          // ISO timestamp
}

export interface Negocio {
  id:                  string;
  nombre:              string;
  categoria:           string;
  descripcion:         string;
  zona:                string;
  direccion:           string;
  whatsapp:            string;
  telefono?:           string;
  email?:              string;
  horario:             string;
  lat?:                number;
  lng?:                number;
  fotos:               string[];       // URLs públicas de Supabase Storage
  propietario_id:      string;
  propietario_nombre:  string;
  estado:              "pendiente" | "aprobado" | "rechazado";
  motivo_rechazo?:     string;
  calificacion:        number;         // promedio 1-5
  total_calificaciones: number;
  creado_en:           string;
  actualizado_en:      string;
}

export interface Calificacion {
  id:              string;
  negocio_id:      string;
  usuario_id:      string;
  usuario_nombre:  string;
  estrellas:       number;
  comentario?:     string;
  creado_en:       string;
}
