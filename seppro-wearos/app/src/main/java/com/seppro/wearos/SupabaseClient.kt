package com.seppro.wearos

object SupabaseClient {
    // ⚠️ Reemplazar con las credenciales exactas de environment.ts
    const val URL = "https://sbhkqjueesxsjkfootuq.supabase.co"
    const val ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiaGtxanVlZXN4c2prZm9vdHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MDE4NDcsImV4cCI6MjEwMTk3Nzg0N30.eWHoi6xpJsaSkHw91aSoT_pdV229tqb0xz054hT5iCg"
    
    // Almacenamiento temporal en memoria del token JWT (suficiente para un prototipo)
    var accessToken: String? = null
}
