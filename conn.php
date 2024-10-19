<?php
    session_start();
    $conn = new mysqli('localhost', 'root', '', 'dicoding');
        
    if ($conn->connect_error) {
        die("Koneksi gagal: " . $conn->connect_error);
    } else {
        echo 'Terkoneksi';
    }
?>