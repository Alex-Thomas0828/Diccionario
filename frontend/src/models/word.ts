export interface Word {
  /** ID único de la palabra (autoincremental) */
  id: number;
  
  /** La palabra en sí (única en el sistema) */
  palabra: string;
  
  /** El significado o definición de la palabra */
  definicion: string;
  

  semantica: string;          // New field
  categoria_grammatica: string; // New field
  ejemplo: string;            // New field

  
  /** Fecha de creación en la base de datos */
  created_at: Date;
  
  /** Fecha de última actualización */
  updated_at: Date;
  
  /** 
   * ID del usuario que creó la palabra (opcional)
   * @optional
   */
  created_by?: number;
}