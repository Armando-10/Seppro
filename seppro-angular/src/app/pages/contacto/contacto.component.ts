import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="contact-hero">
      <div class="container">
        <h1 class="section-title">Contáctanos</h1>
        <p class="section-subtitle">Estamos listos para ayudarte con tu proyecto hidráulico</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="contact-grid">
          <!-- Form -->
          <div class="contact-form glass-card">
            <h2>Envíanos un mensaje</h2>
            <form (ngSubmit)="onSubmit()">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-input" [(ngModel)]="form.nombre" name="nombre" placeholder="Tu nombre" required/>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-input" [(ngModel)]="form.email" name="email" placeholder="Tu correo" required/>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Asunto</label>
                <input type="text" class="form-input" [(ngModel)]="form.asunto" name="asunto" placeholder="Asunto del mensaje"/>
              </div>
              <div class="form-group">
                <label class="form-label">Mensaje</label>
                <textarea class="form-input" [(ngModel)]="form.mensaje" name="mensaje" rows="5" placeholder="Escribe tu mensaje..." required></textarea>
              </div>
              <button type="submit" class="btn-primary" [disabled]="submitted">
                {{ submitted ? '✓ Enviado' : 'Enviar Mensaje →' }}
              </button>
            </form>
          </div>

          <!-- Info + Map -->
          <div class="contact-info-side">
            <div class="info-cards">
              <div class="info-card glass-card">
                <span class="info-icon">📍</span>
                <div>
                  <h4>Dirección</h4>
                  <p>JJXF+8H, 76147 San José el Alto, Qro.</p>
                </div>
              </div>
              <div class="info-card glass-card">
                <span class="info-icon">📞</span>
                <div>
                  <h4>Teléfono</h4>
                  <p><a href="tel:4427109612">442-710-9612</a></p>
                </div>
              </div>
              <div class="info-card glass-card">
                <span class="info-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:sepproqro@gmail.com">sepproqro&#64;gmail.com</a></p>
                </div>
              </div>
              <div class="info-card glass-card">
                <span class="info-icon">🕐</span>
                <div>
                  <h4>Horario</h4>
                  <p>Lun - Vie: 8:00 - 18:00</p>
                </div>
              </div>
            </div>

            <!-- Map (Elemento 12) -->
            <div class="map-container glass-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.5!2d-100.4!3d20.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDM2JzAwLjAiTiAxMDDCsDI0JzAwLjAiVw!5e0!3m2!1ses!2smx!4v1"
                width="100%"
                height="250"
                style="border:0; border-radius: 12px;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-hero {
      padding: 140px 0 60px;
      text-align: center;
      background: radial-gradient(ellipse at 50% 0%, rgba(27,94,32,0.15), transparent 60%);
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 40px;
      align-items: start;
    }
    .contact-form { padding: 36px; }
    .contact-form h2 { color: #F1F5F9; font-size: 1.4rem; margin-bottom: 24px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    textarea.form-input { resize: vertical; min-height: 120px; }

    .info-cards { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .info-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }
    .info-icon { font-size: 1.5rem; }
    .info-card h4 { color: #F1F5F9; font-size: 0.9rem; margin-bottom: 2px; }
    .info-card p { color: #64748B; font-size: 0.85rem; margin: 0; }
    .info-card a { color: #4CAF50; text-decoration: none; }
    .info-card a:hover { text-decoration: underline; }

    .map-container { padding: 8px; overflow: hidden; }

    @media (max-width: 768px) {
      .contact-grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactoComponent {
  form = { nombre: '', email: '', asunto: '', mensaje: '' };
  submitted = false;

  onSubmit() {
    this.submitted = true;
    setTimeout(() => this.submitted = false, 3000);
  }
}
