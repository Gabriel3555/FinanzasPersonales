<?php
session_start();

echo "<h2>Test Simple de Transacciones</h2>";

// Verificar sesión
echo "<h3>1. Verificar Sesión:</h3>";
if (isset($_SESSION['usuario_id'])) {
    echo "✅ Usuario ID: " . $_SESSION['usuario_id'] . "<br>";
    echo "✅ Usuario Nombre: " . $_SESSION['usuario_nombre'] . "<br>";
} else {
    echo "❌ No hay sesión activa<br>";
}

// Test básico del controlador
echo "<h3>2. Test del Controlador:</h3>";
echo "<button onclick='testMostrarTransacciones()'>Test Mostrar Transacciones</button>";
echo "<div id='resultado'></div>";

?>

<script>
function testMostrarTransacciones() {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '<p>Enviando petición...</p>';
    
    const formData = new FormData();
    formData.append('mostrarTransaccion', 'ok');
    
    console.log('Enviando FormData:', Object.fromEntries(formData));
    
    fetch('../controlador/transaccionControlador.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        return response.text();
    })
    .then(text => {
        console.log('Response text:', text);
        resultado.innerHTML = `<pre>${text}</pre>`;
        
        // Intentar parsear como JSON
        try {
            const json = JSON.parse(text);
            console.log('JSON parseado:', json);
        } catch (e) {
            console.error('No se pudo parsear como JSON:', e);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultado.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
    });
}
</script>
