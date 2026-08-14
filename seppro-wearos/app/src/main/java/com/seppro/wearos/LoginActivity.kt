package com.seppro.wearos

import android.content.Intent
import android.os.Bundle
import android.view.Gravity
import android.widget.*
import androidx.activity.ComponentActivity
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

/**
 * LoginActivity - Autenticación nativa contra Supabase
 */
class LoginActivity : ComponentActivity() {

    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var statusText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val mainLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(24, 32, 24, 32)
            setBackgroundColor(0xFFFFFFFF.toInt()) // Blanco
        }

        // Title
        val title = TextView(this).apply {
            text = "SEPPRO"
            textSize = 18f
            setTextColor(0xFF003D7A.toInt()) // Azul Primary
            setTypeface(null, android.graphics.Typeface.BOLD)
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 16)
        }
        mainLayout.addView(title)

        // Email
        emailInput = EditText(this).apply {
            hint = "Correo"
            textSize = 12f
            setHintTextColor(0xFF94A3B8.toInt())
            setTextColor(0xFF0F172A.toInt())
            inputType = android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
            setPadding(16, 12, 16, 12)
            setBackgroundColor(0xFFF1F5F9.toInt()) // Light gray
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(0, 0, 0, 8) }
        }
        mainLayout.addView(emailInput)

        // Password
        passwordInput = EditText(this).apply {
            hint = "Contraseña"
            textSize = 12f
            setHintTextColor(0xFF94A3B8.toInt())
            setTextColor(0xFF0F172A.toInt())
            inputType = android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
            setPadding(16, 12, 16, 12)
            setBackgroundColor(0xFFF1F5F9.toInt()) // Light gray
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(0, 0, 0, 16) }
        }
        mainLayout.addView(passwordInput)

        // Status text
        statusText = TextView(this).apply {
            text = ""
            textSize = 10f
            setTextColor(0xFFEF5350.toInt())
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 8)
        }
        mainLayout.addView(statusText)

        // Login Button
        val loginBtn = Button(this).apply {
            text = "Entrar"
            textSize = 12f
            setTextColor(0xFFFFFFFF.toInt())
            setBackgroundColor(0xFF0072C6.toInt()) // Azul Accent
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setOnClickListener {
                performLogin()
            }
        }
        mainLayout.addView(loginBtn)

        val scrollView = ScrollView(this).apply {
            setBackgroundColor(0xFFFFFFFF.toInt())
            addView(mainLayout)
        }

        setContentView(scrollView)
    }

    private fun performLogin() {
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString()

        if (email.isEmpty() || password.isEmpty()) {
            statusText.text = "Llena todos los campos"
            statusText.setTextColor(0xFFEF5350.toInt())
            return
        }

        statusText.text = "Iniciando sesión..."
        statusText.setTextColor(0xFF4CAF50.toInt())

        thread {
            try {
                val url = URL("${SupabaseClient.URL}/auth/v1/token?grant_type=password")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("apikey", SupabaseClient.ANON_KEY)
                conn.doOutput = true

                val jsonPayload = JSONObject().apply {
                    put("email", email)
                    put("password", password)
                }

                val out = OutputStreamWriter(conn.outputStream)
                out.write(jsonPayload.toString())
                out.close()

                val responseCode = conn.responseCode
                if (responseCode == 200) {
                    val responseStr = conn.inputStream.bufferedReader().use { it.readText() }
                    val jsonResponse = JSONObject(responseStr)
                    SupabaseClient.accessToken = jsonResponse.getString("access_token")
                    
                    runOnUiThread {
                        statusText.text = "¡Conectado!"
                        val intent = Intent(this, MainActivity::class.java)
                        startActivity(intent)
                        finish()
                    }
                } else {
                    val errorStr = conn.errorStream?.bufferedReader()?.use { it.readText() }
                    var msg = "Credenciales incorrectas"
                    try {
                        if (errorStr != null) {
                            msg = JSONObject(errorStr).getString("error_description")
                        }
                    } catch(e: Exception) {}
                    
                    runOnUiThread {
                        statusText.text = msg
                        statusText.setTextColor(0xFFEF5350.toInt())
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
                runOnUiThread {
                    statusText.text = "Error de conexión"
                    statusText.setTextColor(0xFFEF5350.toInt())
                }
            }
        }
    }
}
