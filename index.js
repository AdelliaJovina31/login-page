function previewImage(event) {
    var reader = new FileReader();
    reader.onload = function() {
        let output = document.getElementById('profile-image');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
            
        const name = document.getElementById('name').value;
        const gender = document.querySelector('input[name="jenis-kelamin"]:checked');
        const tempatLahir = document.getElementById('tempat-lahir').value;
        const tglLahir = document.getElementById('tgl-lahir').value;
        const alamat = document.getElementById('alamat').value;
        const email = document.getElementById('email').value;
        const noTlp = document.getElementById('no-tlp').value;
        const hobi = document.getElementById('hobi').value;
        const password = document.getElementById('password').value;
        const passwordConfirmation = document.getElementById('password-confirmation').value;
        
        const profilePicture = document.getElementById('upload').files[0];
        const genderValue = gender ? gender.value : 'Tidak dipilih';

        var emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
        if (!emailPattern.test(email)) {
            alert('Email tidak valid!');
            return;
        }
    
        if (password.length < 8) {
            alert('Panjang password minimal 8 karakter');
            return;
        }
    
        if (!name || !gender || !tempatLahir || !tglLahir || !alamat || !email || !noTlp || !hobi || !password || !passwordConfirmation) {
            alert('Semua field harus diisi!');
            return;
        } else if (password !== passwordConfirmation) {
            alert('Password dan konfirmasi password tidak cocok!');
            return;
        }
    
        // konten modal
        let modalBody = `
            <div style="display: flex; align-items: flex-start;">
                <div style="flex: 1; padding-right: 20px;">
                    <p><strong>Nama Lengkap:</strong> ${name}</p>
                    <p><strong>Jenis Kelamin:</strong> ${gender ? gender.value : 'Tidak dipilih'}</p>
                    <p><strong>Tempat Lahir:</strong> ${tempatLahir}</p>
                    <p><strong>Tanggal Lahir:</strong> ${tglLahir}</p>
                    <p><strong>Alamat:</strong> ${alamat}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>No. HP:</strong> ${noTlp}</p>
                    <p><strong>Hobi:</strong> ${hobi}</p>
                </div>
        `;

        if (profilePicture) {
            const reader = new FileReader();
            reader.onload = function(event) {
                modalBody += `<div style="flex: 0 0 100px; text-align: center;"><p><strong>Gambar Profil:</strong></p><img src="${event.target.result}" alt="Gambar Profil" style="width: 100px; height: auto;"/></div></div>`;
                modalBody += '<button id="confirm-btn">OK</button>';
                document.getElementById('modal-body').innerHTML = modalBody;

                // Tampilkan modal
                const modal = document.getElementById('modal');
                modal.style.display = 'block';
            };
            reader.readAsDataURL(profilePicture);
        } else {
            modalBody += '<button id="confirm-btn">OK</button>';
            document.getElementById('modal-body').innerHTML = modalBody;

            // Tampilkan modal
            const modal = document.getElementById('modal');
            modal.style.display = 'block';
        }


        // Kirim data menggunakan fetch
        fetch('http://localhost/login/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                gender: genderValue, 
                tempatLahir: tempatLahir,
                tglLahir: tglLahir,
                alamat: alamat,
                email: email,
                noTlp: noTlp,
                hobi: hobi,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert("Registrasi berhasil!");
        })
        .catch((error) => {
            console.error('Error:', error);
            // alert("Registrasi gagal. Coba lagi.");
        });
    // });
    
        // warna modal
        const modal = document.getElementById('modal');
        const modalContent = modal.querySelector(".modal-content");
    
        if (gender && gender.value === 'Laki-laki') {
            modalContent.style.backgroundColor = '#77CDFF';
            modalContent.style.color = 'black';
        } else {
            modalContent.style.backgroundColor = '#A02334';
            modalContent.style.color = 'white';
        }

        // tampilkan modal
        document.getElementById('modal-body').innerHTML = modalBody;
        modal.style.display = 'block';
    
        // close modal
        modal.querySelector('.close').onclick = function() {
            modal.style.display = 'none';
        };

        console.log(document.getElementById('confirm-btn'));
    
        setTimeout(() => {
            const confirmBtn = document.getElementById('confirm-btn');
            if (confirmBtn) {
                confirmBtn.onclick = function() {
                    // Kirim data ke register.php dengan AJAX
                    const formData = new FormData();
                    formData.append('name', name);
                    formData.append('gender', gender ? gender.value : 'Tidak dipilih');
                    formData.append('tempatLahir', tempatLahir);
                    formData.append('tglLahir', tglLahir);
                    formData.append('alamat', alamat);
                    formData.append('email', email);
                    formData.append('noTlp', noTlp);
                    formData.append('hobi', hobi);
                    formData.append('password', password);
                    if (profilePicture) {
                        formData.append('profile_picture', profilePicture); // Menambahkan gambar profil jika ada
                    }

                    // AJAX request
                    fetch('register.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.text())
                    .then(data => {
                        alert('Data berhasil disimpan!');
                        modal.style.display = 'none';
                        document.getElementById('registerForm').reset();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Terjadi kesalahan saat menyimpan data.');
                    });
                };
            } else {
                console.error('Tombol confirm-btn tidak ditemukan di DOM!');
            }
        }, 100);
    });
});