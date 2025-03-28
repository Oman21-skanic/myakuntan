<?php
require 'connec.php';
include 'navbar.php';

$query = "
    SELECT a.nama_akun, 
            SUM(t.debit) AS total_debit, 
            SUM(t.kredit) AS total_kredit, 
            (SUM(t.debit) - SUM(t.kredit)) AS saldo
    FROM akun a
    LEFT JOIN transaksi t ON a.id_akun = t.id_akun
    GROUP BY a.id_akun
";

$neraca = mysqli_query($conn, $query);
$total_debit = 0;
$total_kredit = 0;
?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neraca Saldo</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <script>
        function printPage() {
            window.print();
        }
    </script>
</head>

<body>
    <div class="container mt-5">
        <h2 class="mb-4">Neraca Saldo</h2>
        <button class="btn btn-primary mb-3" onclick="printPage()">Print Neraca</button>
        <table class="table table-bordered">
            <thead class="thead-light">
                <tr>
                    <th>Nama Akun</th>
                    <th>Total Debit</th>
                    <th>Total Kredit</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = mysqli_fetch_assoc($neraca)): ?>
                    <?php
                    $total_debit += $row['total_debit'];
                    $total_kredit += $row['total_kredit'];
                    ?>
                    <tr>
                        <td><?= $row['nama_akun'] ?></td>
                        <td>Rp<?= number_format($row['total_debit'], 0, ',', '.') ?></td>
                        <td>Rp<?= number_format($row['total_kredit'], 0, ',', '.') ?></td>
                        <td>Rp<?= number_format($row['saldo'], 0, ',', '.') ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
            <tfoot>
                <tr>
                    <th>Total</th>
                    <th>Rp<?= number_format($total_debit, 0, ',', '.') ?></th>
                    <th>Rp<?= number_format($total_kredit, 0, ',', '.') ?></th>
                    <th></th>
                </tr>
            </tfoot>
        </table>
    </div>


    <!-- Membandingkan saldo kredit dan debit neraca -->
    <div id="balance-comparison" class="text-center mt-4 mb-5">
        <h2 class="mb-4">Perbandingan Saldo</h2>
        <div class="scale mt-5" id="scale">
            <div class="balance" id="debit-balance">
                <span>Total Debit</span>
                <span id="total-debit">Rp<?= number_format($total_debit, 0, ',', '.') ?></span>
            </div>
            <div class="balance" id="credit-balance">
                <span>Total Kredit</span>
                <span id="total-credit">Rp<?= number_format($total_kredit, 0, ',', '.') ?></span>
            </div>
        </div>
        <div id="result"></div>
    </div>

    <style>
        #balance-comparison {
            padding: 20px;
        }

        .scale {
            display: flex;
            justify-content: center;
            margin: 0;
            gap: 20px;
        }

        .balance {
            flex: 1;
            padding: 20px;
            border: 2px solid #ddd;
            border-radius: 10px;
            text-align: center;
            transition: transform 0.5s;
            max-width: 250px;
        }

        #debit-balance {
            background-color: #d4edda;
        }

        #credit-balance {
            background-color: #f8d7da;
        }

        #result {
            font-size: 1.5em;
            margin-top: 20px;
        }

        .analysis-details {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            border: 1px solid #e2e6ea;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
            display: none;
        }
    </style>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const totalDebit = <?= $total_debit ?>;
            const totalCredit = <?= $total_kredit ?>;
            const resultDiv = document.getElementById('result');
            const scaleDiv = document.getElementById('scale');
            const debitBalanceDiv = document.getElementById('debit-balance');
            const creditBalanceDiv = document.getElementById('credit-balance');

            const calculateDifference = () => {
                const difference = Math.abs(totalDebit - totalCredit);
                const percentageDifference = ((difference / Math.max(totalDebit, totalCredit)) * 100).toFixed(2);
                return percentageDifference;
            };

            const provideAnalysis = () => {
                const analysis = document.createElement('div');
                analysis.classList.add('analysis-details');

                if (totalDebit === totalCredit) {
                    resultDiv.innerHTML = '<span style="color: green;">Neraca Saldo Seimbang</span>';
                    analysis.innerHTML = `
                    <p class="text-success">✓ Neraca saldo Anda dalam kondisi seimbang</p>
                    <p>Manajemen keuangan Anda sangat baik. Pertahankan!</p>
                `;
                    scaleDiv.style.transform = 'scale(1.1)';
                } else {
                    const difference = calculateDifference();
                    const imbalanceType = totalDebit > totalCredit ? 'Debit' : 'Kredit';

                    resultDiv.innerHTML = `<span style="color: red;">Neraca Saldo Tidak Seimbang (${difference}%)</span>`;
                    analysis.innerHTML = `
                    <p class="text-danger">⚠️ Ketidakseimbangan Terdeteksi</p>
                    <p>Sisi ${imbalanceType} lebih tinggi dengan selisih ${difference}%</p>
                    <strong>Rekomendasi:</strong>
                    <ul>
                        ${imbalanceType === 'Debit' 
                            ? `<li>Kurangi pengeluaran</li>
                                <li>Tingkatkan sumber pendapatan</li>
                                <li>Evaluasi anggaran bulanan</li>`
                            : `<li>Periksa transaksi kredit</li>
                                <li>Hindari pembiayaan berlebihan</li>
                                <li>Seimbangkan aliran kas</li>`
                        }
                    </ul>
                `;

                    scaleDiv.style.transform = 'scale(1.1)';
                    debitBalanceDiv.style.transform = totalDebit > totalCredit ?
                        'translateY(-20px)' :
                        'translateY(20px)';
                    creditBalanceDiv.style.transform = totalCredit > totalDebit ?
                        'translateY(-20px)' :
                        'translateY(20px)';
                }

                resultDiv.appendChild(analysis);
                analysis.style.display = 'block'; 
            };

            provideAnalysis();
        });
    </script>



    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>