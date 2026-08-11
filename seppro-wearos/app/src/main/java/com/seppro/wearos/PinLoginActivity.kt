package com.seppro.wearos

import android.content.Intent
import android.os.Bundle
import android.view.Gravity
import android.widget.*
import androidx.activity.ComponentActivity
import java.security.MessageDigest

/**
 * PinLoginActivity - Pantalla de autenticación por PIN (Práctica 11-12)
 *
 * Implementa:
 * - Pantalla de inicio de sesión con PIN de 4 dígitos
 * - Hash del PIN (no se almacena en texto plano)
 * - Pantalla principal protegida (no accesible sin auth)
 * - Cierre de sesión
 */
class PinLoginActivity : ComponentActivity() {

    private var enteredPin = ""
    private val correctPinHash = hashPin("1234") // PIN por defecto: 1234
    private lateinit var dotViews: List<TextView>
    private lateinit var statusText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val mainLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(24, 24, 24, 24)
            setBackgroundColor(0xFF0A0F1C.toInt())
        }

        // Title
        val title = TextView(this).apply {
            text = "🔐 SEPPRO"
            textSize = 18f
            setTextColor(0xFF4CAF50.toInt())
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 16)
        }
        mainLayout.addView(title)

        // Subtitle
        val subtitle = TextView(this).apply {
            text = "Ingresa tu PIN"
            textSize = 12f
            setTextColor(0xFF94A3B8.toInt())
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 20)
        }
        mainLayout.addView(subtitle)

        // PIN dots
        val dotsLayout = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 16)
        }

        dotViews = (0..3).map {
            TextView(this).apply {
                text = "○"
                textSize = 22f
                setTextColor(0xFF4CAF50.toInt())
                setPadding(12, 0, 12, 0)
            }
        }
        dotViews.forEach { dotsLayout.addView(it) }
        mainLayout.addView(dotsLayout)

        // Status text
        statusText = TextView(this).apply {
            text = ""
            textSize = 10f
            setTextColor(0xFFEF5350.toInt())
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 12)
        }
        mainLayout.addView(statusText)

        // Keypad
        val keypadLayout = GridLayout(this).apply {
            columnCount = 3
            setPadding(0, 8, 0, 0)
        }

        val keys = listOf("1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫")
        keys.forEach { key ->
            val btn = Button(this).apply {
                text = key
                textSize = 16f
                setTextColor(0xFFF1F5F9.toInt())
                setBackgroundColor(0xFF1E293B.toInt())
                setPadding(0, 8, 0, 8)
                minimumWidth = 60
                minimumHeight = 48

                if (key.isEmpty()) {
                    visibility = android.view.View.INVISIBLE
                } else {
                    setOnClickListener {
                        when (key) {
                            "⌫" -> removeDigit()
                            else -> addDigit(key)
                        }
                    }
                }
            }

            val params = GridLayout.LayoutParams().apply {
                width = 0
                height = GridLayout.LayoutParams.WRAP_CONTENT
                columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
                setMargins(2, 2, 2, 2)
            }
            keypadLayout.addView(btn, params)
        }

        mainLayout.addView(keypadLayout)

        // Scroll for small screens
        val scrollView = ScrollView(this).apply {
            setBackgroundColor(0xFF0A0F1C.toInt())
            addView(mainLayout)
        }

        setContentView(scrollView)
    }

    private fun addDigit(digit: String) {
        if (enteredPin.length < 4) {
            enteredPin += digit
            updateDots()

            if (enteredPin.length == 4) {
                verifyPin()
            }
        }
    }

    private fun removeDigit() {
        if (enteredPin.isNotEmpty()) {
            enteredPin = enteredPin.dropLast(1)
            updateDots()
            statusText.text = ""
        }
    }

    private fun updateDots() {
        dotViews.forEachIndexed { index, dot ->
            dot.text = if (index < enteredPin.length) "●" else "○"
        }
    }

    private fun verifyPin() {
        val inputHash = hashPin(enteredPin)
        if (inputHash == correctPinHash) {
            // PIN correcto - ir a pantalla principal
            statusText.setTextColor(0xFF4CAF50.toInt())
            statusText.text = "✓ Acceso concedido"

            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        } else {
            // PIN incorrecto
            statusText.setTextColor(0xFFEF5350.toInt())
            statusText.text = "PIN incorrecto"
            enteredPin = ""
            updateDots()
        }
    }

    /**
     * Hash del PIN - Las credenciales NO se almacenan en texto plano (Práctica 11-12)
     */
    private fun hashPin(pin: String): String {
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(pin.toByteArray())
        return digest.joinToString("") { "%02x".format(it) }
    }
}
