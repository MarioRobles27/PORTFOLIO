  // Menu toggle functionality
    document.getElementById('menu-toggle').addEventListener('click', function() {
      alert('Menú de navegación se abrirá aquí');
    });
    
    // Scroll to content when clicking the circle
    document.querySelector('.contenedor-circulo').addEventListener('click', function() {
      document.querySelector('.portfolio-container').scrollIntoView({ 
        behavior: 'smooth' 
      });
    });
    
    // Simple animation on page load
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        document.querySelector('.header-content').style.opacity = '1';
        document.querySelector('.header-content').style.transform = 'translateY(0)';
      }, 300);
    });
