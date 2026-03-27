require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log(`❌ Error: Username dan Password harus diisi.`)
    console.log(`Cara Penggunaan: node scripts/update-password.js <username> <password_baru>`)
    console.log(`Contoh: node scripts/update-password.js suyadifamilybakery17 kutoarjo2711`)
    process.exit(1)
  }

  const username = args[0]
  const password = args[1]
  const prisma = new PrismaClient()

  console.log(`--- Memulai proses pembaruan data login ---`)
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    // Gunakan upsert: Jika username sudah ada, update password-nya. Jika belum ada, buat akun baru.
    const admin = await prisma.admin.upsert({
      where: { username },
      update: {
        passwordHash: hashedPassword
      },
      create: {
        username,
        passwordHash: hashedPassword
      }
    })

    console.log(`✅ Berhasil! Akun Admin telah diperbarui:`)
    console.log(`Username: ${admin.username}`)
    console.log(`Password: (Berhasil diperbarui dan dienkripsi di database)`)
    console.log(`Silakan coba login kembali dengan password baru Anda.`)
  } catch (error) {
    console.error(`❌ Terjadi kesalahan saat database update:`, error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error('❌ Terjadi kesalahan:', e)
  process.exit(1)
})
