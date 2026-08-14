package com.seppro.wearos

import android.animation.ObjectAnimator
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.animation.DecelerateInterpolator
import android.widget.*
import androidx.activity.ComponentActivity
import org.json.JSONArray
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

/**
 * MainActivity - Pantalla nativa PRO con animaciones y datos detallados
 */
class MainActivity : ComponentActivity() {

    private lateinit var contentLayout: LinearLayout
    private lateinit var loadingText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        contentLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(16, 24, 16, 24)
            setBackgroundColor(0xFFFFFFFF.toInt()) // Blanco
        }

        // Title
        val title = TextView(this).apply {
            text = "Mis Pedidos"
            textSize = 16f
            setTextColor(0xFF003D7A.toInt()) // Azul Primary
            setTypeface(null, android.graphics.Typeface.BOLD)
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 16)
        }
        contentLayout.addView(title)

        loadingText = TextView(this).apply {
            text = "Cargando..."
            textSize = 12f
            setTextColor(0xFF94A3B8.toInt())
            gravity = Gravity.CENTER
        }
        contentLayout.addView(loadingText)

        val scrollView = ScrollView(this).apply {
            setBackgroundColor(0xFFFFFFFF.toInt())
            addView(contentLayout)
        }

        setContentView(scrollView)

        fetchPedidos()
    }

    private fun fetchPedidos() {
        val token = SupabaseClient.accessToken
        if (token == null) {
            loadingText.text = "Error: No hay sesión"
            return
        }

        thread {
            try {
                // Hacer el GET a la tabla de pedidos trayendo la relación pedido_items
                val url = URL("${SupabaseClient.URL}/rest/v1/pedidos?select=*,pedido_items(*)")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("apikey", SupabaseClient.ANON_KEY)
                conn.setRequestProperty("Authorization", "Bearer $token")

                val responseCode = conn.responseCode
                if (responseCode == 200) {
                    val responseStr = conn.inputStream.bufferedReader().use { it.readText() }
                    val pedidosArray = JSONArray(responseStr)

                    runOnUiThread {
                        contentLayout.removeView(loadingText)
                        
                        if (pedidosArray.length() == 0) {
                            val emptyText = TextView(this).apply {
                                text = "No tienes pedidos."
                                textSize = 12f
                                setTextColor(0xFF94A3B8.toInt())
                                gravity = Gravity.CENTER
                            }
                            contentLayout.addView(emptyText)
                        } else {
                            for (i in 0 until pedidosArray.length()) {
                                val pedido = pedidosArray.getJSONObject(i)
                                renderPedidoPRO(pedido, delayMs = (i * 150).toLong())
                            }
                        }
                    }
                } else {
                    runOnUiThread {
                        loadingText.text = "Error al cargar ($responseCode)"
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
                runOnUiThread {
                    loadingText.text = "Error de red"
                }
            }
        }
    }

    private fun renderPedidoPRO(pedido: org.json.JSONObject, delayMs: Long) {
        val estado = pedido.optString("estado", "pendiente")
        
        // Obtener nombre del producto real
        var nombreProducto = "Pedido #${pedido.optInt("id", 0)}"
        val itemsArray = pedido.optJSONArray("pedido_items")
        if (itemsArray != null && itemsArray.length() > 0) {
            val primerItem = itemsArray.getJSONObject(0)
            nombreProducto = primerItem.optString("nombre_producto", "Producto")
            if (itemsArray.length() > 1) {
                nombreProducto += " y ${itemsArray.length() - 1} más"
            }
        }

        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(0xFFF1F5F9.toInt()) // Light gray de la web
            setPadding(16, 16, 16, 16)
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(0, 0, 0, 16) }
            
            // Iniciar invisible para la animación
            alpha = 0f
            translationY = 50f
        }

        // Título (Nombre del Producto)
        val title = TextView(this).apply {
            text = nombreProducto
            textSize = 14f
            setTextColor(0xFF0F172A.toInt()) // Slate oscuro
            setTypeface(null, android.graphics.Typeface.BOLD)
            maxLines = 1
            ellipsize = android.text.TextUtils.TruncateAt.END
        }
        card.addView(title)

        // Definir Icono, Color, Progreso y ETA según estado
        var icon = "🕒"
        var color = 0xFFFFA000.toInt() // Naranja
        var targetProgress = 20
        var etaText = "Procesando pago..."

        when (estado.lowercase()) {
            "pagado" -> {
                icon = "💳"
                color = 0xFF4CAF50.toInt()
                targetProgress = 40
                etaText = "En 3 a 5 días"
            }
            "enviado" -> {
                icon = "📦"
                color = 0xFF2196F3.toInt()
                targetProgress = 60
                etaText = "En 2 días"
            }
            "en_camino" -> {
                icon = "🚚"
                color = 0xFF9C27B0.toInt()
                targetProgress = 80
                etaText = "Llega mañana"
            }
            "entregado" -> {
                icon = "✅"
                color = 0xFF0072C6.toInt()
                targetProgress = 100
                etaText = "Entregado"
            }
        }

        // Fila de Estatus
        val statusLayout = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, 8, 0, 8)
        }

        val statusText = TextView(this).apply {
            text = "$icon  ${estado.uppercase()}"
            textSize = 12f
            setTextColor(color)
            setTypeface(null, android.graphics.Typeface.BOLD)
        }
        statusLayout.addView(statusText)
        card.addView(statusLayout)

        // Barra de Progreso PRO
        val progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            max = 100
            progress = 0
            progressDrawable.setColorFilter(color, android.graphics.PorterDuff.Mode.SRC_IN)
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                8
            ).apply { setMargins(0, 4, 0, 8) }
        }
        card.addView(progressBar)

        // Texto de ETA (Entrega estimada)
        val etaView = TextView(this).apply {
            text = "Estimado: $etaText"
            textSize = 10f
            setTextColor(0xFF64748B.toInt()) // Slate claro
            setTypeface(null, android.graphics.Typeface.ITALIC)
        }
        card.addView(etaView)

        contentLayout.addView(card)

        // Ejecutar Animaciones con retraso en cascada
        card.post {
            // Animación de aparición de la tarjeta
            card.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(400)
                .setStartDelay(delayMs)
                .setInterpolator(DecelerateInterpolator())
                .start()

            // Animación de la barra de progreso
            ObjectAnimator.ofInt(progressBar, "progress", 0, targetProgress).apply {
                duration = 1000
                startDelay = delayMs + 300
                interpolator = DecelerateInterpolator()
                start()
            }
        }
    }
}
