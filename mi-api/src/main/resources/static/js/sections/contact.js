document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    // Claves directas para evitar errores de carga entre archivos
    const SB_URL = 'https://cwjbpiuqvxiubctdyhsc.supabase.co';
    const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3amJwaXVxdnhpdWJjdGR5aHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjQ0MTksImV4cCI6MjA5MjIwMDQxOX0.ICnz4xSdJ_l-XUX9xEVecG23lEeKtUisFPLQKS6M6nY';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                contact_info: formData.get('contact_info'),
                message: formData.get('message')
            };

            console.log("Intentando enviar a Supabase...", data);

            try {
                const response = await fetch(`${SB_URL}/rest/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SB_KEY,
                        'Authorization': `Bearer ${SB_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok || response.status === 201) {
                    console.log("¡Éxito!");
                    contactForm.reset(); // Limpiar campos
                    contactForm.style.display = 'none';
                    successMessage.classList.add('active');
                    
                    if (window.gsap) {
                        gsap.from(successMessage, {
                            y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
                        });
                    }
                } else {
                    const errorData = await response.json();
                    console.error("Error de Supabase:", errorData);
                    throw new Error('Failed to send');
                }
            } catch (error) {
                console.error('Error completo:', error);
                alert('Error al enviar. Revisa la consola para más detalles.');
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }
});
