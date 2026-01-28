# Happi - Deployment & Telegram Setup Guide

Bu rehber, uygulamanı internette yayınlaman (Vercel) ve Telegram'a bağlaman için gereken adımları içerir.

## 1. Uygulamayı Yayınlama (Vercel)
Uygulamanın Telegram'da çalışması için "https" destekli bir adreste olması gerekir. Vercel bunu ücretsiz sağlar.

1.  **GitHub'a Yükle:**
    *   Projeni GitHub'a yükle (eğer yapmadıysan `git` komutlarıyla veya GitHub Desktop ile).
2.  **Vercel Hesabı Aç:**
    *   [Vercel.com](https://vercel.com/) adresine git ve GitHub hesabınla giriş yap.
3.  **Yeni Proje Ekle:**
    *   "Add New..." -> "Project" butonuna tıkla.
    *   GitHub'daki **Happi** projesini seç ve "Import" de.
4.  **Çevre Değişkenleri (Environment Variables):**
    *   Import ekranında "Environment Variables" kısmını genişlet.
    *   Supabase bilgilerini buraya ekle:
        *   `VITE_SUPABASE_URL`: (Supabase URL'in)
        *   `VITE_SUPABASE_ANON_KEY`: (Supabase Key'in)
5.  **Deploy:**
    *   "Deploy" butonuna bas.
    *   Kısa süre sonra sana bir link verecek (örn: `https://happi-app.vercel.app`). Bu linki kopyala.

## 2. Telegram Bot Kurulumu
1.  Telegram'da **@BotFather** kullanıcısını bul ve başlat.
2.  `/newbot` komutunu gönder.
3.  Botuna bir isim ver (örn: `Happi Dating`).
4.  Botuna bir kullanıcı adı ver (sonu 'bot' ile bitmeli, örn: `happi_dating_bot`).
5.  BotFather sana bir API Token verecek (bunu sakla, ileride lazım olabilir ama şu an Mini App için şart değil).

## 3. Mini App (Web App) Ayarı
1.  BotFather'a `/mybots` yaz.
2.  Oluşturduğun botu seç.
3.  **Bot Settings** -> **Menu Button** -> **Configure Menu Button** yolunu izle.
4.  Sana bir link soracak. Vercel'den aldığın linki (örn: `https://happi-app.vercel.app`) yapıştır.
5.  Button ismine "Start Dating" veya "Happi" yazabilirsin.

## 4. Test Etme
*   Kendi botuna git, "Start" veya menü butonuna bas.
*   Uygulaman Telegram'ın içinde açılacak! 🎉

## Notlar
*   **Mobilde Test:** Telegram mobil uygulamasından botuna girip tıkladığında tam ekran açıldığını göreceksin.
*   **Bilgisayarda Test:** Bilgisayarda da aynı şekilde çalışır.
