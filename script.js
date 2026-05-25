let database = JSON.parse(localStorage.getItem('moneyTreeData')) || [];

function pindahLayar(namaLayar) {
    document.getElementById('layar-beranda').classList.add('hidden');
    document.getElementById('layar-arsip').classList.add('hidden');
    
    if (namaLayar === 'beranda') {
        document.getElementById('layar-beranda').classList.remove('hidden');
    } else {
        document.getElementById('layar-arsip').classList.remove('hidden');
        tampilkanArsip();
    }
}

function simpanData() {
    const nama = document.getElementById('nama-item').value;
    const harga = document.getElementById('harga-item').value;
    const tanggal = document.getElementById('tanggal-item').value;

    if (!nama || !harga || !tanggal) {
        alert("Ops! Isi semua data dulu ya biar rapi.");
        return;
    }

    const dataBaru = {
        id: Date.now(),
        nama: nama,
        harga: parseFloat(harga),
        tanggal: tanggal,
        bulan: new Date(tanggal).toLocaleString('id-ID', { month: 'long', year: 'numeric' })
    };

    database.push(dataBaru);
    localStorage.setItem('moneyTreeData', JSON.stringify(database));
    
    document.getElementById('nama-item').value = '';
    document.getElementById('harga-item').value = '';
    
    alert("Berhasil dicatat!");
    pindahLayar('arsip');
}

function tampilkanArsip() {
    const wadah = document.getElementById('arsip-konten');
    wadah.innerHTML = '';

    if (database.length === 0) {
        wadah.innerHTML = '<p style="text-align:center; color:#94a3b8; margin-top:20px;">Belum ada catatan.</p>';
        return;
    }

    const grupBulan = {};
    database.forEach(item => {
        if (!grupBulan[item.bulan]) grupBulan[item.bulan] = [];
        grupBulan[item.bulan].push(item);
    });

    for (let bulan in grupBulan) {
        let htmlBulan = `
            <div class="bulan-group">
                <span class="bulan-badge">${bulan}</span>
        `;
        
        // URUTKAN: Terbesar ke Terkecil
        grupBulan[bulan].sort((a, b) => b.harga - a.harga);

        grupBulan[bulan].forEach(item => {
            htmlBulan += `
                <div class="item-card">
                    <div class="item-info">
                        <span>${item.nama}</span>
                        <small>${item.tanggal}</small>
                    </div>
                    <div class="item-harga">
                        Rp ${item.harga.toLocaleString('id-ID')}
                    </div>
                </div>
            `;
        });

        htmlBulan += `</div>`;
        wadah.innerHTML += htmlBulan;
    }
}

function resetArsip() {
    if (confirm("Hapus semua memori pengeluaran?")) {
        database = [];
        localStorage.removeItem('moneyTreeData');
        tampilkanArsip();
    }
}