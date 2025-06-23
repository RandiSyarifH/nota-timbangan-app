import React, { useState } from 'react';
import { Calendar, Clock, Truck, DollarSign, FileText, Plus, Download, Settings } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    produk: 'Singkong',
    lokasi: 'Thailand',
    registrasi: 'MTA',
    tanggal: new Date().toISOString().split('T')[0],
    jam: new Date().toTimeString().slice(0, 5),
    supplier: 'IWAN',
    noPolisi: '8695',
    muatan: '',
    kosong: '',
    hargaPerKg: '1320',
    bongkar: '30000',
    ampera: '20000',
    persentaseKadar: '39'
  });

  const [showNota, setShowNota] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotals = () => {
    const beratKotor = parseFloat(formData.muatan) || 0;
    const beratMobil = parseFloat(formData.kosong) || 0;
    const hargaPerKg = parseFloat(formData.hargaPerKg) || 0;
    const bongkar = parseFloat(formData.bongkar) || 0;
    const ampera = parseFloat(formData.ampera) || 0;
    const persentaseKadar = parseFloat(formData.persentaseKadar) || 39;

    const beratBersih = beratKotor - beratMobil;
    const potongKadar = beratBersih * (persentaseKadar / 100);
    const beratFinal = beratBersih - potongKadar;
    const totalHarga = beratFinal * hargaPerKg;
    const totalPembayaran = totalHarga - bongkar - ampera;

    return {
      beratBersih: Math.round(beratBersih),
      potongKadar: Math.round(potongKadar), 
      beratFinal: Math.round(beratFinal),
      totalHarga: Math.round(totalHarga),
      totalPembayaran: Math.round(totalPembayaran),
      persentaseKadar: persentaseKadar
    };
  };

  const totals = calculateTotals();

  const generateNota = () => {
    setShowNota(true);
  };

  const resetForm = () => {
    setShowNota(false);
    setFormData({
      ...formData,
      muatan: '',
      kosong: '',
      persentaseKadar: '39',
      tanggal: new Date().toISOString().split('T')[0],
      jam: new Date().toTimeString().slice(0, 5)
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const numberToWords = (num) => {
    const ones = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
    const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
    const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
    const thousands = ['', 'ribu', 'juta', 'miliar'];

    if (num === 0) return 'nol';

    const convertHundreds = (n) => {
      let result = '';
      if (n >= 100) {
        if (Math.floor(n / 100) === 1) {
          result += 'seratus ';
        } else {
          result += ones[Math.floor(n / 100)] + ' ratus ';
        }
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };

    let result = '';
    let thousandIndex = 0;
    
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        let chunkWords = convertHundreds(chunk);
        if (thousandIndex === 1 && chunk === 1) {
          chunkWords = 'seribu ';
        } else if (thousandIndex > 0) {
          chunkWords += thousands[thousandIndex] + ' ';
        }
        result = chunkWords + result;
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }

    return result.trim() + ' rupiah';
  };

  // Komponen Nota Single - Portrait Compact
  const NotaSingle = () => (
    <div className="border-2 border-black bg-white mx-auto" style={{width: '175mm', minHeight: '120mm', fontSize: '12px', fontFamily: 'Arial, sans-serif', padding: '15mm'}}>
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <div className="font-bold text-lg">MIM AGRO</div>
        <div className="font-bold text-base">NOTA TIMBANGAN DAN PEMBAYARAN</div>
      </div>

      {/* Info Header dalam bentuk tabel rapat */}
      <table className="w-full mb-3" style={{fontSize: '11px', borderCollapse: 'collapse'}}>
        <tbody>
          <tr>
            <td style={{width: '55px', padding: '1px 2px'}}>{formData.produk}</td>
            <td style={{width: '5px', padding: '1px 1px'}}>:</td>
            <td style={{width: '80px', padding: '1px 2px'}}>{formData.lokasi}</td>
            <td style={{width: '55px', padding: '1px 5px'}}>Registrasi</td>
            <td style={{width: '5px', padding: '1px 1px'}}>:</td>
            <td style={{width: '50px', padding: '1px 2px'}}>{formData.registrasi}</td>
          </tr>
          <tr>
            <td style={{padding: '1px 2px'}}>Tanggal</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 2px'}}>{formData.tanggal}</td>
            <td style={{padding: '1px 5px'}}>Supplier</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 2px'}}>{formData.supplier}</td>
          </tr>
          <tr>
            <td style={{padding: '1px 2px'}}>Jam</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 2px'}}>{formData.jam}</td>
            <td style={{padding: '1px 5px'}}>No. Polisi</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 2px'}}>{formData.noPolisi}</td>
          </tr>
        </tbody>
      </table>

      {/* Garis Pemisah Timbangan */}
      <div className="text-center border-t border-b border-black py-1 mb-2" style={{fontSize: '12px'}}>
        <span className="font-bold">--- Timbangan ---</span>
      </div>

      {/* Tabel Timbangan Rapat */}
      <table className="w-full mb-3" style={{fontSize: '11px', borderCollapse: 'collapse'}}>
        <tbody>
          <tr>
            <td style={{width: '60px', padding: '1px 2px'}}>+ Muatan</td>
            <td style={{width: '5px', padding: '1px 1px'}}>:</td>
            <td style={{width: '60px', padding: '1px 2px', textAlign: 'right'}}>{formData.muatan}</td>
            <td style={{width: '60px', padding: '1px 10px'}}>- Netto</td>
            <td style={{width: '5px', padding: '1px 1px'}}>:</td>
            <td style={{width: '60px', padding: '1px 2px', textAlign: 'right'}}>{totals.beratBersih}</td>
          </tr>
          <tr>
            <td style={{padding: '1px 2px'}}>- Kosong</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 2px', textAlign: 'right'}}>{formData.kosong}</td>
            <td style={{padding: '1px 10px'}}>- Refraksi</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 2px', textAlign: 'right'}}>{totals.persentaseKadar}%</td>
          </tr>
          <tr>
            <td colSpan="3"></td>
            <td style={{padding: '1px 10px'}}>- Total timbangan bersih</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 2px', textAlign: 'right', fontWeight: 'bold'}}>{totals.beratFinal}</td>
          </tr>
        </tbody>
      </table>

      {/* Garis Pemisah Pembayaran */}
      <div className="text-center border-t border-b border-black py-1 mb-2" style={{fontSize: '11px'}}>
        <span className="font-bold">--- Pembayaran ---</span>
      </div>

      {/* Tabel Pembayaran Rapat */}
      <table className="w-full mb-3" style={{fontSize: '11px', borderCollapse: 'collapse'}}>
        <tbody>
          <tr>
            <td style={{width: '50px', padding: '1px 2px'}}>+ Harga</td>
            <td style={{width: '5px', padding: '1px 1px'}}>:</td>
            <td style={{width: '20px', padding: '1px 1px', textAlign: 'left'}}>Rp</td>
            <td style={{width: '60px', padding: '1px 2px', textAlign: 'right'}}>{formatCurrency(formData.hargaPerKg)}</td>
            <td style={{width: '50px', padding: '1px 10px'}}>- Bongkar</td>
            <td style={{width: '5px', padding: '1px 1px'}}>:</td>
            <td style={{width: '20px', padding: '1px 1px', textAlign: 'left'}}>Rp</td>
            <td style={{width: '60px', padding: '1px 2px', textAlign: 'right'}}>{formatCurrency(formData.bongkar)}</td>
          </tr>
          <tr>
            <td style={{padding: '1px 2px'}}>+ Jumlah</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 1px', textAlign: 'left'}}>Rp</td>
            <td style={{padding: '1px 2px', textAlign: 'right'}}>{formatCurrency(totals.totalHarga)}</td>
            <td style={{padding: '1px 10px'}}>- Ampera</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 1px', textAlign: 'left'}}>Rp</td>
            <td style={{padding: '1px 2px', textAlign: 'right'}}>{formatCurrency(formData.ampera)}</td>
          </tr>
          <tr>
            <td colSpan="4"></td>
            <td style={{padding: '1px 10px', fontWeight: 'bold'}}>- Total pembayaran nota</td>
            <td style={{padding: '1px 1px'}}>:</td>
            <td style={{padding: '1px 1px', textAlign: 'left', fontWeight: 'bold'}}>Rp</td>
            <td style={{padding: '1px 2px', textAlign: 'right', fontWeight: 'bold'}}>{formatCurrency(totals.totalPembayaran)}</td>
          </tr>
        </tbody>
      </table>

      {/* Footer dengan terbilang dalam kotak */}
      <div className="border border-black mt-4 p-2 bg-gray-100 text-center" style={{fontSize: '10px'}}>
        <div className="font-bold">{numberToWords(totals.totalPembayaran)}</div>
      </div>
    </div>
  );

  const downloadPDF = async () => {
    try {
      // Load jsPDF library dinamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(script);
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });

      // Access jsPDF from global window
      const { jsPDF } = window.jspdf;
      
      // Create new PDF document - F4 size (210 x 330 mm)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 330]
      });

      // Set font
      doc.setFont('helvetica');
      
      let yPos = 20;
      
      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MIM AGRO', 105, yPos, { align: 'center' });
      yPos += 8;
      
      doc.setFontSize(14);
      doc.text('NOTA TIMBANGAN DAN PEMBAYARAN', 105, yPos, { align: 'center' });
      yPos += 10;
      
      // Draw line
      doc.line(20, yPos, 190, yPos);
      yPos += 8;
      
      // Info section
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Row 1
      doc.text(`${formData.produk}`, 20, yPos);
      doc.text(':', 50, yPos);
      doc.text(`${formData.lokasi}`, 55, yPos);
      doc.text('Registrasi', 120, yPos);
      doc.text(':', 145, yPos);
      doc.text(`${formData.registrasi}`, 150, yPos);
      yPos += 6;
      
      // Row 2
      doc.text('Tanggal', 20, yPos);
      doc.text(':', 50, yPos);
      doc.text(`${formData.tanggal}`, 55, yPos);
      doc.text('Supplier', 120, yPos);
      doc.text(':', 145, yPos);
      doc.text(`${formData.supplier}`, 150, yPos);
      yPos += 6;
      
      // Row 3
      doc.text('Jam', 20, yPos);
      doc.text(':', 50, yPos);
      doc.text(`${formData.jam}`, 55, yPos);
      doc.text('No. Polisi', 120, yPos);
      doc.text(':', 145, yPos);
      doc.text(`${formData.noPolisi}`, 150, yPos);
      yPos += 10;
      
      // Timbangan section
      doc.setFont('helvetica', 'bold');
      doc.text('--- Timbangan ---', 105, yPos, { align: 'center' });
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 8;
      
      doc.setFont('helvetica', 'normal');
      
      // Timbangan data
      doc.text('+ Muatan', 20, yPos);
      doc.text(':', 50, yPos);
      doc.text(`${formData.muatan}`, 85, yPos, { align: 'right' });
      doc.text('- Netto', 110, yPos);
      doc.text(':', 135, yPos);
      doc.text(`${totals.beratBersih}`, 175, yPos, { align: 'right' });
      yPos += 6;
      
      doc.text('- Kosong', 20, yPos);
      doc.text(':', 50, yPos);
      doc.text(`${formData.kosong}`, 85, yPos, { align: 'right' });
      doc.text('- Refraksi', 110, yPos);
      doc.text(':', 135, yPos);
      doc.text(`${totals.persentaseKadar}%`, 175, yPos, { align: 'right' });
      yPos += 6;
      
      doc.text('- Total timbangan bersih', 110, yPos);
      doc.text(':', 135, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(`${totals.beratFinal}`, 175, yPos, { align: 'right' });
      yPos += 10;
      
      // Pembayaran section
      doc.setFont('helvetica', 'bold');
      doc.text('--- Pembayaran ---', 105, yPos, { align: 'center' });
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 8;
      
      doc.setFont('helvetica', 'normal');
      
      // Pembayaran data
      doc.text('+ Harga', 20, yPos);
      doc.text(':', 50, yPos);
      doc.text('Rp', 55, yPos);
      doc.text(`${formatCurrency(formData.hargaPerKg)}`, 85, yPos, { align: 'right' });
      doc.text('- Bongkar', 110, yPos);
      doc.text(':', 135, yPos);
      doc.text('Rp', 140, yPos);
      doc.text(`${formatCurrency(formData.bongkar)}`, 175, yPos, { align: 'right' });
      yPos += 6;
      
      doc.text('+ Jumlah', 20, yPos);
      doc.text(':', 50, yPos);
      doc.text('Rp', 55, yPos);
      doc.text(`${formatCurrency(totals.totalHarga)}`, 85, yPos, { align: 'right' });
      doc.text('- Ampera', 110, yPos);
      doc.text(':', 135, yPos);
      doc.text('Rp', 140, yPos);
      doc.text(`${formatCurrency(formData.ampera)}`, 175, yPos, { align: 'right' });
      yPos += 6;
      
      doc.setFont('helvetica', 'bold');
      doc.text('- Total pembayaran nota', 110, yPos);
      doc.text(':', 135, yPos);
      doc.text('Rp', 140, yPos);
      doc.text(`${formatCurrency(totals.totalPembayaran)}`, 175, yPos, { align: 'right' });
      yPos += 10;
      
      // Terbilang box
      doc.rect(20, yPos, 170, 12);
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos, 170, 12, 'F');
      doc.rect(20, yPos, 170, 12);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const terbilang = numberToWords(totals.totalPembayaran);
      doc.text(terbilang, 105, yPos + 7, { align: 'center' });
      
      // Save PDF
      const filename = `Nota-Timbangan-${formData.tanggal}-${formData.jam.replace(':', '')}.pdf`;
      doc.save(filename);
      
      // Remove script after use
      document.head.removeChild(script);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    }
  };

  if (showNota) {
    return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold text-center mb-4">Preview: Nota Timbangan (F4 Portrait)</h2>
            <div className="overflow-auto">
              <NotaSingle />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={resetForm}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Nota Baru
            </button>
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <FileText size={16} />
              Cetak Preview
            </button>
            <button
              onClick={downloadPDF}
              className="bg-red-600 text-white px-6 py-2 rounded hover:red-700 flex items-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
          📋 Aplikasi Nota Timbangan MIM AGRO
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              📝 Data Nota
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produk
                </label>
                <input
                  type="text"
                  name="produk"
                  value={formData.produk}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registrasi
                </label>
                <input
                  type="text"
                  name="registrasi"
                  value={formData.registrasi}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Jam
                </label>
                <input
                  type="time"
                  name="jam"
                  value={formData.jam}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Polisi
              </label>
              <input
                type="text"
                name="noPolisi"
                value={formData.noPolisi}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">
              <Truck className="inline w-5 h-5 mr-2" />
              Data Timbangan
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Berat Kotor (kg)
                </label>
                <input
                  type="number"
                  name="muatan"
                  value={formData.muatan}
                  onChange={handleInputChange}
                  placeholder="14690"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Berat Mobil (kg)
                </label>
                <input
                  type="number"
                  name="kosong"
                  value={formData.kosong}
                  onChange={handleInputChange}
                  placeholder="3500"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Settings className="inline w-4 h-4 mr-1" />
                Persentase Potong Kadar (%)
              </label>
              <input
                type="number"
                name="persentaseKadar"
                value={formData.persentaseKadar}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                placeholder="39"
                className="w-full p-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 bg-white"
              />
              <p className="text-xs text-gray-600 mt-1">
                Default: 39%. Ubah sesuai kebutuhan
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">
              <DollarSign className="inline w-5 h-5 mr-2" />
              Data Pembayaran
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga per kg (Rp)
                </label>
                <input
                  type="number"
                  name="hargaPerKg"
                  value={formData.hargaPerKg}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bongkar (Rp)
                  </label>
                  <input
                    type="number"
                    name="bongkar"
                    value={formData.bongkar}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ampera (Rp)
                  </label>
                  <input
                    type="number"
                    name="ampera"
                    value={formData.ampera}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              🧮 Preview Perhitungan
            </h2>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Hasil Timbangan:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Berat Bersih:</span>
                  <span className="font-medium">{totals.beratBersih} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Potong Kadar ({totals.persentaseKadar}%):</span>
                  <span className="font-medium">{totals.potongKadar} kg</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Berat Final:</span>
                  <span className="text-blue-600">{totals.beratFinal} kg</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">Perhitungan Pembayaran:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Harga total:</span>
                  <span>Rp {formatCurrency(totals.totalHarga)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bongkar:</span>
                  <span>Rp {formatCurrency(formData.bongkar || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ampera:</span>
                  <span>Rp {formatCurrency(formData.ampera || 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-lg">
                  <span>Total Bayar:</span>
                  <span className="text-green-600">Rp {formatCurrency(totals.totalPembayaran)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={generateNota}
              disabled={!formData.muatan || !formData.kosong}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <FileText size={20} />
              Generate Nota
            </button>

            <p className="text-sm text-gray-600 text-center">
              Isi data muatan dan kosong untuk generate nota
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;