<?php
class Conexion {

    public static function conectar() {
        $nombreServidor = "localhost";
        $puerto = 3307;
        $usuarioServidor = "root";
        $baseDatos = "finanzas_personales";
        $password  = "";

        try {
            $objConexion = new PDO(
                "mysql:host=$nombreServidor;port=$puerto;dbname=$baseDatos;charset=utf8",
                $usuarioServidor,
                $password
            );
        } catch (Exception $e) {
            $objConexion = $e;
        }

        return $objConexion;
    }
}
