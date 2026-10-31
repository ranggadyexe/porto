import { PDFDocument } from "pdf-lib";

// Adapted from wade-convert (AGPL-3.0), trimmed to four browser-only tools.
export const MAKS_MB = 20;
export const MAKS_HALAMAN = 100;
export const KUALITAS_DEFAULT = 0.8;

export const EKSTENSI_GAMBAR = [".jpg", ".jpeg", ".png", ".webp"] as const;
export const EKSTENSI_KE_PDF = [".jpg", ".jpeg", ".png"] as const;
export const EKSTENSI_PDF = [".pdf"] as const;

const A4 = { lebar: 595.28, tinggi: 841.89 };
const MARGIN = 24;

function namaDasar(nama: string): string {
  return nama.replace(/\.[^.]+$/, "");
}

export function namaHasilKompres(nama: string): string {
  return `${namaDasar(nama)}-compressed.jpg`;
}

export async function kompresGambar(
  berkas: File,
  opsi: { kualitas?: number } = {},
): Promise<Blob> {
  const kualitas = opsi.kualitas ?? KUALITAS_DEFAULT;
  const bitmap = await createImageBitmap(berkas);
  const kanvas = document.createElement("canvas");
  kanvas.width = bitmap.width;
  kanvas.height = bitmap.height;
  const konteks = kanvas.getContext("2d");
  if (!konteks) {
    bitmap.close();
    throw new Error("Canvas unavailable");
  }
  konteks.fillStyle = "#ffffff";
  konteks.fillRect(0, 0, kanvas.width, kanvas.height);
  konteks.drawImage(bitmap, 0, 0);
  bitmap.close();
  const hasil = await new Promise<Blob | null>((resolve) =>
    kanvas.toBlob(resolve, "image/jpeg", kualitas),
  );
  if (!hasil) throw new Error("Compression failed");
  return hasil;
}

export type HasilGambarKePdf = {
  blob: Blob;
  jumlahHalaman: number;
};

export function namaHasilGambarKePdf(nama: string): string {
  return `${namaDasar(nama)}.pdf`;
}

export async function gambarKePdf(
  berkas: readonly File[],
): Promise<HasilGambarKePdf> {
  if (berkas.length > MAKS_HALAMAN) {
    throw new Error(`Exceeds ${MAKS_HALAMAN} pages`);
  }
  const dokumen = await PDFDocument.create();
  for (const file of berkas) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const png =
      file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    const gambar = png
      ? await dokumen.embedPng(bytes)
      : await dokumen.embedJpg(bytes);
    const halaman = dokumen.addPage([A4.lebar, A4.tinggi]);
    const skala = Math.min(
      (A4.lebar - MARGIN * 2) / gambar.width,
      (A4.tinggi - MARGIN * 2) / gambar.height,
    );
    const lebar = gambar.width * skala;
    const tinggi = gambar.height * skala;
    halaman.drawImage(gambar, {
      x: (A4.lebar - lebar) / 2,
      y: (A4.tinggi - tinggi) / 2,
      width: lebar,
      height: tinggi,
    });
  }
  const bytes = await dokumen.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    jumlahHalaman: berkas.length,
  };
}

export async function muatPdf(berkas: File): Promise<PDFDocument> {
  const dokumen = await PDFDocument.load(await berkas.arrayBuffer(), {
    ignoreEncryption: true,
  });
  if (dokumen.getPageCount() > MAKS_HALAMAN) {
    throw new Error(`Exceeds ${MAKS_HALAMAN} pages`);
  }
  return dokumen;
}

export async function jumlahHalamanPdf(berkas: File): Promise<number> {
  return (await muatPdf(berkas)).getPageCount();
}

export type HasilGabung = {
  blob: Blob;
  jumlahHalaman: number;
};

export function namaHasilGabung(nama: string): string {
  return `${namaDasar(nama)}-merged.pdf`;
}

export async function gabungPdf(berkas: readonly File[]): Promise<HasilGabung> {
  const hasil = await PDFDocument.create();
  let jumlahHalaman = 0;
  for (const file of berkas) {
    const dokumen = await muatPdf(file);
    const halaman = await hasil.copyPages(dokumen, dokumen.getPageIndices());
    for (const h of halaman) hasil.addPage(h);
    jumlahHalaman += halaman.length;
    if (jumlahHalaman > MAKS_HALAMAN) {
      throw new Error(`Exceeds ${MAKS_HALAMAN} pages`);
    }
  }
  const bytes = await hasil.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    jumlahHalaman,
  };
}

export type HasilPisah = {
  blob: Blob;
  jumlahHalaman: number;
};

export function parseRentang(teks: string, maksHalaman: number): number[] {
  const bersih = teks.trim();
  if (!bersih) throw new Error("Empty page range");
  const indeks: number[] = [];
  for (const bagian of bersih.split(",")) {
    const potongan = bagian.trim();
    const cocok = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(potongan);
    if (!cocok) throw new Error(`Invalid range: ${potongan}`);
    const awal = Number(cocok[1]);
    const akhir = cocok[2] ? Number(cocok[2]) : awal;
    if (awal < 1 || akhir < 1) {
      throw new Error("Pages start at 1");
    }
    if (awal > akhir) {
      throw new Error(`Reversed range: ${potongan}`);
    }
    if (akhir > maksHalaman) {
      throw new Error(`Page ${akhir} exceeds ${maksHalaman}`);
    }
    for (let halaman = awal; halaman <= akhir; halaman++) {
      indeks.push(halaman - 1);
    }
  }
  return indeks;
}

export function namaHasilPisah(nama: string): string {
  return `${namaDasar(nama)}-split.pdf`;
}

export async function pisahPdf(
  berkas: File,
  indeks: readonly number[],
): Promise<HasilPisah> {
  const sumber = await muatPdf(berkas);
  const hasil = await PDFDocument.create();
  const halaman = await hasil.copyPages(sumber, [...indeks]);
  for (const h of halaman) hasil.addPage(h);
  const bytes = await hasil.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    jumlahHalaman: halaman.length,
  };
}
