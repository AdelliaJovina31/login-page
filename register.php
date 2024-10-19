<?php
header('Content-Type: application/json');
require 'conn.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["error" => "Data tidak valid"]);
    exit();
}

// Ambil data dari input
$name = $data['name'];
$gender = $data['gender'];
$tempatLahir = $data['tempatLahir'];
$tglLahir = $data['tglLahir'];
$alamat = $data['alamat'];
$email = $data['email'];
$noTlp = $data['noTlp'];
$hobi = $data['hobi'];
$password = $data['password'];


if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] == 0) {
    $targetDir = "assets/profile-pict";
    $targetFile = $targetDir . basename($_FILES['profile_picture']['name']);
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    $check = getimagesize($_FILES['profile_picture']['tmp_name']);
    if ($check === false) {
        echo json_encode(["error" => "File yang diunggah bukan gambar."]);
        exit();
    }

    if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $targetFile)) {
        $profilePictureName = basename($_FILES['profile_picture']['name']);
    } else {
        echo json_encode(["error" => "Terjadi kesalahan saat mengunggah gambar."]);
        exit();
    }
} else {
    $profilePictureName = null; // Jika tidak ada gambar yang diunggah
}

// Validasi input
if (empty($name) || empty($tempatLahir) || empty($tglLahir) || empty($alamat) || empty($email) || empty($noTlp) || empty($hobi) || empty($password)) {
    echo json_encode(["error" => "Semua field harus diisi!"]);
    exit();
}

$lastID = mysqli_query($conn, "SELECT MAX(id_user) AS max_id FROM users");
$row = mysqli_fetch_assoc($lastID);
$newID = $row['max_id'] + 1;

// Masukkan data ke database
$sql = "INSERT INTO users (id_user, name, gender, tempat_lahir, tgl_lahir, alamat, email, no_tlp, hobi, password)
        VALUES ('$newID', '$name', '$gender', '$tempatLahir', '$tglLahir', '$alamat', '$email', '$noTlp', '$hobi', '$password')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Registrasi berhasil!"]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$conn->close();
?>
