package com.seppro.wearos

import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.*
import androidx.activity.ComponentActivity

/**
 * MainActivity - Pantalla principal protegida con WebView (Práctica 5-6, 11-12)
 *
 * Carga la página web de SEPPRO desplegada en Vercel dentro de un WebView
 * adaptado para Wear OS. Solo es accesible después de la autenticación por PIN.
 *
 * Widget de conexión con wearable:
 * - WebView carga el sitio web completo
 * - Transferencia de datos: productos, categorías, estadísticas vía API REST
 * - Propósito: Consultar catálogo y estadísticas desde el reloj
 */
class MainActivity : ComponentActivity() {

    // ⚠️ CAMBIAR ESTA URL por la URL de tu despliegue en Vercel
    private val SEPPRO_URL = "https://seppro-angular.vercel.app"

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val mainLayout = FrameLayout(this).apply {
            setBackgroundColor(0xFF0A0F1C.toInt())
        }

        // WebView
        webView = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                loadWithOverviewMode = true
                useWideViewPort = true
                builtInZoomControls = true
                displayZoomControls = false
                setSupportZoom(true)
                cacheMode = WebSettings.LOAD_DEFAULT
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

                // Optimizaciones para Wear OS
                textZoom = 80  // Texto más pequeño para pantalla del reloj
            }

            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                    // Mantener navegación dentro del WebView
                    url?.let { view?.loadUrl(it) }
                    return true
                }
            }

            loadUrl(SEPPRO_URL)
        }

        mainLayout.addView(webView)

        // Floating logout button
        val logoutBtn = Button(this).apply {
            text = "✕"
            textSize = 12f
            setTextColor(0xFFFFFFFF.toInt())
            setBackgroundColor(0xAAC62828.toInt())
            minimumWidth = 40
            minimumHeight = 40
            setPadding(4, 4, 4, 4)

            val params = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.TOP or Gravity.END
            ).apply {
                setMargins(0, 8, 8, 0)
            }
            layoutParams = params

            setOnClickListener {
                // Cerrar sesión - volver a PinLogin
                finish()
            }
        }
        mainLayout.addView(logoutBtn)

        setContentView(mainLayout)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
