import { PrismaClient } from './prisma/generated/client';
const prisma = new PrismaClient();
async function main() {
    const artist = await prisma.artists.create({
        data: {
            name: "Kaleb Berhane",
            email: "kaleb@example.com",
            password_hash: "Welcome", // ⚠️ plaintext for now (not secure)
            bio: "Independent music artist passionate about soulful R&B and Afrobeat.",
            country: "Canada",
            profile_image_url: "https://example.com/images/kaleb.jpg",
            auth_provider: "local",
            provider_id: null,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });
    console.log("Artist created successfully:", artist);
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=index.js.map