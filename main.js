/* =========================================================
   1. DATA DUMMY
   ========================================================= */

// Data Dummy Siswa
const dataSiswa = [
    { nis: "1001", nama: "Ainun Rahman", kelas: "XI RPL 1", jenis_kelamin: "Laki-laki", email: "ainunr@example.com", password: "12345" },
    { nis: "1002", nama: "Putri Aisyah", kelas: "XI RPL 1", jenis_kelamin: "Perempuan", email: "putri@example.com", password: "12345" },
    { nis: "1003", nama: "Budi Santoso", kelas: "XI RPL 2", jenis_kelamin: "Laki-laki", email: "budi@example.com", password: "12345" },
    { nis: "1004", nama: "Siti Nurhaliza", kelas: "XI RPL 1", jenis_kelamin: "Perempuan", email: "siti@example.com", password: "12345" },
    { nis: "1005", nama: "Andi Wijaya", kelas: "XI RPL 2", jenis_kelamin: "Laki-laki", email: "andi@example.com", password: "12345" },
    { nis: "1006", nama: "Dewi Lestari", kelas: "XI RPL 1", jenis_kelamin: "Perempuan", email: "dewi@example.com", password: "12345" },
    { nis: "1007", nama: "Rizky Pratama", kelas: "XI RPL 2", jenis_kelamin: "Laki-laki", email: "rizky@example.com", password: "12345" },
    { nis: "1008", nama: "Maya Sari", kelas: "XI RPL 1", jenis_kelamin: "Perempuan", email: "maya@example.com", password: "12345" }
];

// Data Dummy Admin
const dataAdmin = [{ username: "admin", password: "admin123" }];

// Data Dummy Absensi
const dataAbsensi = [
    { tanggal: "2026-10-01", nis: "1001", nama: "Ainun Rahman", kelas: "XI RPL 1", jam_masuk: "07:15", jam_keluar: "15:30", status: "Hadir" },
    { tanggal: "2026-10-01", nis: "1002", nama: "Putri Aisyah", kelas: "XI RPL 1", jam_masuk: "07:20", jam_keluar: "15:30", status: "Hadir" },
    { tanggal: "2026-10-01", nis: "1003", nama: "Budi Santoso", kelas: "XI RPL 2", jam_masuk: "-", jam_keluar: "-", status: "Sakit" },
    { tanggal: "2026-09-30", nis: "1001", nama: "Ainun Rahman", kelas: "XI RPL 1", jam_masuk: "07:10", jam_keluar: "15:30", status: "Hadir" },
    { tanggal: "2026-09-30", nis: "1002", nama: "Putri Aisyah", kelas: "XI RPL 1", jam_masuk: "-", jam_keluar: "-", status: "Izin" },
    { tanggal: "2026-09-29", nis: "1001", nama: "Ainun Rahman", kelas: "XI RPL 1", jam_masuk: "07:05", jam_keluar: "15:30", status: "Hadir" },
    { tanggal: "2026-09-29", nis: "1004", nama: "Siti Nurhaliza", kelas: "XI RPL 1", jam_masuk: "-", jam_keluar: "-", status: "Alfa" }
];

// Data untuk Chart Admin
const dataChartBulanan = {
    labels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
    datasets: [{
        label: "Persentase Kehadiran (%)",
        data: [95, 92, 98, 96],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 5
    }]
};

/* =========================================================
   2. STATE GLOBAL
   ========================================================= */

let myChart = null;
let currentPageSiswa = 1;
let currentPageAbsensi = 1;
const itemsPerPage = 5;

/* =========================================================
   3. ROUTER HALAMAN
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formLoginSiswa')) {
        initLoginPage();
    }
    if (document.getElementById('btnAbsen')) {
        initSiswaDashboard();
    }
    if (document.getElementById('chartAbsensi')) {
        initAdminDashboard();
    }
});

/* =========================================================
   4. HALAMAN LOGIN
   ========================================================= */

function initLoginPage() {
    if (localStorage.getItem('userSession')) {
        const session = JSON.parse(localStorage.getItem('userSession'));
        window.location.href = session.role === 'siswa' ? 'siswa_dashboard.html' : 'admin_dashboard.html';
        return;
    }

    const formSiswa = document.getElementById('formLoginSiswa');
    formSiswa.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailOrNis = document.getElementById('siswaEmail').value;
        const password = document.getElementById('siswaPassword').value;
        const siswa = dataSiswa.find(s => (s.email === emailOrNis || s.nis === emailOrNis) && s.password === password);
        if (siswa) {
            localStorage.setItem('userSession', JSON.stringify({ role: 'siswa', data: siswa }));
            window.location.href = 'siswa_dashboard.html';
        } else {
            alert('Login Gagal! Email/NIS atau Password salah.');
        }
    });

    const formAdmin = document.getElementById('formLoginAdmin');
    formAdmin.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const admin = dataAdmin.find(a => a.username === username && a.password === password);
        if (admin) {
            localStorage.setItem('userSession', JSON.stringify({ role: 'admin', data: admin }));
            window.location.href = 'admin_dashboard.html';
        } else {
            alert('Login Gagal! Username atau Password salah.');
        }
    });
}

/* =========================================================
   5. DASHBOARD SISWA
   ========================================================= */

function initSiswaDashboard() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    if (!session || session.role !== 'siswa') { window.location.href = 'index.html'; return; }
    const user = session.data;

    document.getElementById('welcomeText').innerText = `Selamat datang, ${user.nama}`;
    document.getElementById('profNis').innerText = `: ${user.nis}`;
    document.getElementById('profNama').innerText = `: ${user.nama}`;
    document.getElementById('profKelas').innerText = `: ${user.kelas}`;
    document.getElementById('profJK').innerText = `: ${user.jenis_kelamin}`;
    document.getElementById('profEmail').innerText = `: ${user.email}`;

    // Dark Mode
    const darkToggle = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Sidebar & Logout
    document.getElementById('sidebarCollapse').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userSession');
        window.location.href = 'index.html';
    });

    // Absensi
    const btnAbsen = document.getElementById('btnAbsen');
    const statusText = document.getElementById('statusAbsenText');
    const today = new Date().toISOString().split('T')[0];
    let absenStatus = localStorage.getItem(`absen_${user.nis}_${today}`);

    if (absenStatus === 'masuk') {
        btnAbsen.className = 'btn btn-warning btn-absence';
        btnAbsen.innerHTML = '<i class="fas fa-sign-out-alt me-2"></i> ABSEN PULANG';
        statusText.innerText = 'Anda sudah Absen Masuk hari ini.';
    } else if (absenStatus === 'pulang') {
        btnAbsen.disabled = true;
        btnAbsen.className = 'btn btn-secondary btn-absence';
        btnAbsen.innerHTML = '<i class="fas fa-check-double me-2"></i> SELESAI';
        statusText.innerText = 'Anda sudah Absen Masuk dan Pulang hari ini.';
    }

    btnAbsen.addEventListener('click', () => {
        const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        if (!absenStatus) {
            localStorage.setItem(`absen_${user.nis}_${today}`, 'masuk');
            btnAbsen.className = 'btn btn-warning btn-absence';
            btnAbsen.innerHTML = '<i class="fas fa-sign-out-alt me-2"></i> ABSEN PULANG';
            statusText.innerText = `Anda sudah Absen Masuk pada ${timeString}.`;
            alert(`Berhasil Absen Masuk pada ${timeString}!`);
            absenStatus = 'masuk';
        } else if (absenStatus === 'masuk') {
            localStorage.setItem(`absen_${user.nis}_${today}`, 'pulang');
            btnAbsen.disabled = true;
            btnAbsen.className = 'btn btn-secondary btn-absence';
            btnAbsen.innerHTML = '<i class="fas fa-check-double me-2"></i> SELESAI';
            statusText.innerText = `Anda sudah Absen Pulang pada ${timeString}.`;
            alert(`Berhasil Absen Pulang pada ${timeString}!`);
        }
    });

    // Navigasi Tab
    window.showTab = (tab, el) => {
        document.getElementById('dashboard-content').style.display = 'none';
        document.getElementById('kalender-content').style.display = 'none';
        document.getElementById('riwayat-content').style.display = 'none';
        document.getElementById('profil-content').style.display = 'none';
        document.querySelectorAll('#sidebar ul li a').forEach(a => a.classList.remove('active'));
        if (el) el.classList.add('active');

        if (tab === 'kalender') { document.getElementById('kalender-content').style.display = 'block'; renderKalender(user.nis); }
        else if (tab === 'riwayat') { document.getElementById('riwayat-content').style.display = 'block'; renderRiwayat(user.nis); }
        else if (tab === 'profil') { document.getElementById('profil-content').style.display = 'block'; }
        else { document.getElementById('dashboard-content').style.display = 'block'; }
    };

    function renderRiwayat(nis) {
        const tbody = document.getElementById('tableRiwayat');
        tbody.innerHTML = '';
        const filtered = dataAbsensi.filter(d => d.nis === nis);
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Belum ada data.</td></tr>';
            return;
        }
        filtered.forEach(item => {
            let badgeClass = 'bg-success';
            if (item.status === 'Izin') badgeClass = 'bg-warning text-dark';
            if (item.status === 'Sakit') badgeClass = 'bg-info text-dark';
            if (item.status === 'Alfa') badgeClass = 'bg-danger';
            tbody.innerHTML += `<tr><td>${item.tanggal}</td><td>${item.jam_masuk}</td><td>${item.jam_keluar}</td><td><span class="badge ${badgeClass}">${item.status}</span></td></tr>`;
        });
    }

    // Kalender
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

    function renderKalender(nis) {
        const grid = document.getElementById('calendarGrid');
        document.getElementById('calendarMonthYear').innerText = `${monthNames[currentMonth]} ${currentYear}`;
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        grid.innerHTML = '';
        ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].forEach(d => {
            grid.innerHTML += `<div class="calendar-day-name">${d}</div>`;
        });
        for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="calendar-day empty"></div>`;
        const todayStr = new Date().toISOString().split('T')[0];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const abs = dataAbsensi.find(a => a.nis === nis && a.tanggal === dateStr);
            let cls = '';
            if (abs) {
                if (abs.status === 'Hadir') cls = 'hadir';
                else if (abs.status === 'Izin') cls = 'izin';
                else if (abs.status === 'Sakit') cls = 'sakit';
                else if (abs.status === 'Alfa') cls = 'alfa';
            }
            if (dateStr === todayStr) cls += ' today';
            grid.innerHTML += `<div class="calendar-day ${cls}">${day}</div>`;
        }
    }
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderKalender(user.nis);
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderKalender(user.nis);
    });
}

/* =========================================================
   6. DASHBOARD ADMIN
   ========================================================= */

function initAdminDashboard() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    if (!session || session.role !== 'admin') { window.location.href = 'index.html'; return; }

    // Dark Mode
    const darkToggle = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    document.getElementById('sidebarCollapse').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userSession');
        window.location.href = 'index.html';
    });

    renderDashboardStats();
    renderChart();
    renderTabelSiswa();
    renderTabelAbsensi();

    window.showAdminTab = (tab, el) => {
        document.getElementById('admin-dashboard-content').style.display = 'none';
        document.getElementById('manajemen-siswa-content').style.display = 'none';
        document.getElementById('manajemen-absensi-content').style.display = 'none';
        document.querySelectorAll('#sidebar ul li a').forEach(a => a.classList.remove('active'));
        if (el) el.classList.add('active');

        if (tab === 'manajemen_siswa') { document.getElementById('manajemen-siswa-content').style.display = 'block'; renderTabelSiswa(); }
        else if (tab === 'manajemen_absensi') { document.getElementById('manajemen-absensi-content').style.display = 'block'; renderTabelAbsensi(); }
        else { document.getElementById('admin-dashboard-content').style.display = 'block'; }
    };

    function renderDashboardStats() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('totalSiswa').innerText = dataSiswa.length;
        const td = dataAbsensi.filter(d => d.tanggal === today);
        document.getElementById('hadirHariIni').innerText = td.filter(d => d.status === 'Hadir').length;
        document.getElementById('izinSakitHariIni').innerText = td.filter(d => d.status === 'Izin' || d.status === 'Sakit').length;
        document.getElementById('alfaHariIni').innerText = td.filter(d => d.status === 'Alfa').length;
    }

    function renderChart() {
        const ctx = document.getElementById('chartAbsensi').getContext('2d');
        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'bar',
            data: dataChartBulanan,
            options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } }, animation: { duration: 2000, easing: 'easeOutQuart' } }
        });
    }

    function renderTabelSiswa() {
        const tbody = document.getElementById('tableManajemenSiswa');
        const search = (document.getElementById('searchSiswa')?.value || '').toLowerCase();
        const fK = document.getElementById('filterKelas')?.value || '';
        const fJ = document.getElementById('filterJK')?.value || '';
        let filtered = dataSiswa.filter(s => {
            return (s.nama.toLowerCase().includes(search) || s.nis.includes(search)) && (!fK || s.kelas === fK) && (!fJ || s.jenis_kelamin === fJ);
        });
        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPageSiswa > totalPages) currentPageSiswa = 1;
        const start = (currentPageSiswa - 1) * itemsPerPage;
        const paginated = filtered.slice(start, start + itemsPerPage);
        tbody.innerHTML = '';
        if (paginated.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Tidak ada data.</td></tr>';
        } else {
            paginated.forEach(s => {
                const i = dataSiswa.indexOf(s);
                tbody.innerHTML += `<tr><td>${s.nis}</td><td>${s.nama}</td><td>${s.kelas}</td><td>${s.jenis_kelamin}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="bukaModalEdit(${i})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="bukaModalHapus('siswa', ${i})"><i class="fas fa-trash"></i></button>
                    </td></tr>`;
            });
        }
        renderPagination('paginationSiswa', currentPageSiswa, totalPages, filtered.length, (p) => { currentPageSiswa = p; renderTabelSiswa(); });
    }

    function renderTabelAbsensi() {
        const tbody = document.getElementById('tableManajemenAbsensi');
        const search = (document.getElementById('searchAbsensi')?.value || '').toLowerCase();
        const fT = document.getElementById('filterTanggal')?.value || '';
        const fS = document.getElementById('filterStatus')?.value || '';
        let filtered = dataAbsensi.filter(a => {
            return a.nama.toLowerCase().includes(search) && (!fT || a.tanggal === fT) && (!fS || a.status === fS);
        });
        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPageAbsensi > totalPages) currentPageAbsensi = 1;
        const start = (currentPageAbsensi - 1) * itemsPerPage;
        const paginated = filtered.slice(start, start + itemsPerPage);
        tbody.innerHTML = '';
        if (paginated.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Tidak ada data.</td></tr>';
        } else {
            paginated.forEach(a => {
                const i = dataAbsensi.indexOf(a);
                let cls = 'bg-success';
                if (a.status === 'Izin') cls = 'bg-warning text-dark';
                if (a.status === 'Sakit') cls = 'bg-info text-dark';
                if (a.status === 'Alfa') cls = 'bg-danger';
                tbody.innerHTML += `<tr><td>${a.tanggal}</td><td>${a.nama}</td><td>${a.kelas}</td><td>${a.jam_masuk}</td><td>${a.jam_keluar}</td><td><span class="badge ${cls}">${a.status}</span></td>
                    <td><button class="btn btn-sm btn-danger" onclick="bukaModalHapus('absensi', ${i})"><i class="fas fa-trash"></i></button></td></tr>`;
            });
        }
        renderPagination('paginationAbsensi', currentPageAbsensi, totalPages, filtered.length, (p) => { currentPageAbsensi = p; renderTabelAbsensi(); });
    }

    function renderPagination(containerId, currentPage, totalPages, totalItems, cb) {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (totalItems === 0) { container.innerHTML = ''; return; }
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        let html = `<div class="pagination-info">Menampilkan ${startItem}-${endItem} dari ${totalItems} data</div>`;
        html += '<nav><ul class="pagination pagination-sm mb-0">';
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></a></li>`;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></a></li>`;
        html += '</ul></nav>';
        container.innerHTML = html;
        container.querySelectorAll('a[data-page]').forEach(a => {
            a.addEventListener('click', (e) => { e.preventDefault(); cb(parseInt(a.dataset.page)); });
        });
    }

    window.simpanSiswa = () => {
        const s = {
            nis: document.getElementById('addNis').value,
            nama: document.getElementById('addNama').value,
            kelas: document.getElementById('addKelas').value,
            jenis_kelamin: document.getElementById('addJK').value,
            email: document.getElementById('addEmail').value,
            password: document.getElementById('addPassword').value
        };
        dataSiswa.push(s);
        bootstrap.Modal.getInstance(document.getElementById('modalTambahSiswa')).hide();
        document.getElementById('formTambahSiswa').reset();
        renderTabelSiswa(); renderDashboardStats();
        alert('Data siswa berhasil ditambahkan!');
    };

    window.bukaModalEdit = (index) => {
        const s = dataSiswa[index];
        document.getElementById('editIndex').value = index;
        document.getElementById('editNis').value = s.nis;
        document.getElementById('editNama').value = s.nama;
        document.getElementById('editKelas').value = s.kelas;
        document.getElementById('editJK').value = s.jenis_kelamin;
        document.getElementById('editEmail').value = s.email;
        document.getElementById('editPassword').value = s.password;
        new bootstrap.Modal(document.getElementById('modalEditSiswa')).show();
    };

    window.updateSiswa = () => {
        const i = document.getElementById('editIndex').value;
        dataSiswa[i] = {
            nis: document.getElementById('editNis').value,
            nama: document.getElementById('editNama').value,
            kelas: document.getElementById('editKelas').value,
            jenis_kelamin: document.getElementById('editJK').value,
            email: document.getElementById('editEmail').value,
            password: document.getElementById('editPassword').value
        };
        bootstrap.Modal.getInstance(document.getElementById('modalEditSiswa')).hide();
        renderTabelSiswa(); renderDashboardStats();
        alert('Data siswa berhasil diperbarui!');
    };

    window.bukaModalHapus = (tipe, index) => {
        document.getElementById('hapusIndex').value = index;
        document.getElementById('hapusTipe').value = tipe;
        const pesan = tipe === 'siswa'
            ? `Apakah Anda yakin ingin menghapus siswa <b>${dataSiswa[index].nama}</b>?`
            : `Apakah Anda yakin ingin menghapus data absensi <b>${dataAbsensi[index].nama}</b>?`;
        document.getElementById('hapusPesan').innerHTML = pesan;
        new bootstrap.Modal(document.getElementById('modalHapusKonfirmasi')).show();
    };

    window.konfirmasiHapus = () => {
        const i = parseInt(document.getElementById('hapusIndex').value);
        const t = document.getElementById('hapusTipe').value;
        if (t === 'siswa') { dataSiswa.splice(i, 1); renderTabelSiswa(); renderDashboardStats(); alert('Data siswa dihapus!'); }
        else { dataAbsensi.splice(i, 1); renderTabelAbsensi(); renderDashboardStats(); alert('Data absensi dihapus!'); }
        bootstrap.Modal.getInstance(document.getElementById('modalHapusKonfirmasi')).hide();
    };

    window.exportCSV = (tipe) => {
        let data = [], filename = '';
        if (tipe === 'siswa') {
            data = [['NIS','Nama','Kelas','JK','Email'], ...dataSiswa.map(s => [s.nis, s.nama, s.kelas, s.jenis_kelamin, s.email])];
            filename = 'data_siswa.csv';
        } else {
            data = [['Tanggal','NIS','Nama','Kelas','Masuk','Keluar','Status'], ...dataAbsensi.map(a => [a.tanggal, a.nis, a.nama, a.kelas, a.jam_masuk, a.jam_keluar, a.status])];
            filename = 'data_absensi.csv';
        }
        const csv = data.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        alert(`Data berhasil diexport ke ${filename}!`);
    };

    window.exportPDF = (tipe) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let title = '', head = [], body = [], filename = '';
        if (tipe === 'siswa') {
            title = 'Data Siswa - SIA Absensi';
            head = [['NIS','Nama','Kelas','JK','Email']];
            body = dataSiswa.map(s => [s.nis, s.nama, s.kelas, s.jenis_kelamin, s.email]);
            filename = 'data_siswa.pdf';
        } else {
            title = 'Data Absensi - SIA Absensi';
            head = [['Tanggal','Nama','Kelas','Masuk','Keluar','Status']];
            body = dataAbsensi.map(a => [a.tanggal, a.nama, a.kelas, a.jam_masuk, a.jam_keluar, a.status]);
            filename = 'data_absensi.pdf';
        }
        doc.setFontSize(16);
        doc.text(title, 14, 20);
        doc.setFontSize(10);
        doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 14, 28);
        doc.autoTable({ head: head, body: body, startY: 35, theme: 'grid', headStyles: { fillColor: [59, 130, 246] }, styles: { fontSize: 9 } });
        doc.save(filename);
        alert(`Data berhasil diexport ke ${filename}!`);
    };
}