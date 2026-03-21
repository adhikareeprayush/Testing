import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbFile = path.resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbFile}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "dairy" },
      update: {},
      create: {
        name: "Dairy Products",
        slug: "dairy",
        description: "Fresh milk, cheese, butter and dairy essentials",
        image: "/assets/Homepage/Hero/Dairy.svg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "vegetables-fruits" },
      update: {},
      create: {
        name: "Vegetables & Fruits",
        slug: "vegetables-fruits",
        description: "Farm-fresh seasonal vegetables and fruits",
        image: "/assets/Homepage/Hero/Fruits and vegetables.svg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "spices-seasoning" },
      update: {},
      create: {
        name: "Spices & Seasoning",
        slug: "spices-seasoning",
        description: "Authentic local spices and seasonings",
        image: "/assets/Homepage/Hero/Condiments.svg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "local-groceries" },
      update: {},
      create: {
        name: "Local Groceries",
        slug: "local-groceries",
        description: "Essential everyday groceries from local farms",
        image: "/assets/Homepage/Hero/Grain and pasta.svg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "local-seasonal" },
      update: {},
      create: {
        name: "Local & Seasonal",
        slug: "local-seasonal",
        description: "Seasonal picks fresh from local farmers",
        image: "/assets/Homepage/Hero/Baby food.svg",
      },
    }),
  ]);

  const [dairy, vegFruits, spices, groceries, seasonal] = categories;

  const adminPassword = await bcrypt.hash("admin123", 12);
  const superPassword = await bcrypt.hash("super123", 12);
  const farmerPassword = await bcrypt.hash("farmer123", 12);
  const userPassword = await bcrypt.hash("user1234", 12);

  // Super admin — analytics & farmer verification
  await prisma.user.upsert({
    where: { email: "superadmin@farmcommerce.com" },
    update: { role: "SUPER_ADMIN", farmerVerified: false },
    create: {
      name: "Super Admin",
      email: "superadmin@farmcommerce.com",
      password: superPassword,
      role: "SUPER_ADMIN",
      farmerVerified: false,
    },
  });

  // Legacy admin → super admin
  await prisma.user.upsert({
    where: { email: "admin@farmcommerce.com" },
    update: { role: "SUPER_ADMIN", farmerVerified: false },
    create: {
      name: "Platform Admin",
      email: "admin@farmcommerce.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
      farmerVerified: false,
    },
  });

  // Verified farmer — owns seeded catalog
  const verifiedFarmer = await prisma.user.upsert({
    where: { email: "farmer@farmcommerce.com" },
    update: {
      role: "FARMER",
      farmerVerified: true,
      farmerVerifiedAt: new Date("2024-01-01"),
    },
    create: {
      name: "Hari Prasad (Verified Farmer)",
      email: "farmer@farmcommerce.com",
      password: farmerPassword,
      role: "FARMER",
      farmerVerified: true,
      farmerVerifiedAt: new Date("2024-01-01"),
      phone: "+977-9811111111",
      city: "Kavre",
    },
  });

  // Pending farmer — must be verified by super admin
  await prisma.user.upsert({
    where: { email: "farmer-pending@farmcommerce.com" },
    update: { role: "FARMER", farmerVerified: false, farmerVerifiedAt: null },
    create: {
      name: "Pending Farmer",
      email: "farmer-pending@farmcommerce.com",
      password: farmerPassword,
      role: "FARMER",
      farmerVerified: false,
      city: "Pokhara",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@farmcommerce.com" },
    update: { role: "USER" },
    create: {
      name: "Prayush Adhikari",
      email: "demo@farmcommerce.com",
      password: userPassword,
      phone: "+977-9800000000",
      address: "123 Farm Road",
      city: "Kathmandu",
      state: "Bagmati",
      zip: "44600",
      role: "USER",
    },
  });

  console.log(
    "✅ Users: superadmin@farmcommerce.com / super123 | admin@farmcommerce.com / admin123 | farmer@farmcommerce.com / farmer123 | farmer-pending@farmcommerce.com / farmer123 | demo@farmcommerce.com / user1234"
  );

  const img = (id: string) =>
    `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

  const products = [
    { name: "Fresh Farm Milk", slug: "fresh-farm-milk", description: "Pure, fresh cow's milk sourced from local farms. Rich in calcium and nutrients.", price: 3.99, comparePrice: 5.0, image: img("photo-1563636619-e9143da7973b"), stock: 100, categoryId: dairy.id, badge: "Fresh", isFeatured: true, unit: "1L", weight: "1kg" },
    { name: "Organic Butter", slug: "organic-butter", description: "Creamy organic butter made from the finest local milk.", price: 6.49, comparePrice: 8.0, image: img("photo-1589985270826-458126f0840e"), stock: 60, categoryId: dairy.id, unit: "250g" },
    { name: "Farm Cheese", slug: "farm-cheese", description: "Artisan cheese aged to perfection in traditional style.", price: 8.99, comparePrice: 11.0, image: img("photo-1486297678162-eb2a19b0a32d"), stock: 45, categoryId: dairy.id, badge: "Artisan", unit: "200g" },
    { name: "Greek Yogurt", slug: "greek-yogurt", description: "Thick and creamy Greek yogurt packed with probiotics.", price: 4.49, image: img("photo-1488477181946-6428a0291777"), stock: 80, categoryId: dairy.id, isTrending: true, unit: "500g" },
    { name: "Fresh Cream", slug: "fresh-cream", description: "Rich, fresh cream perfect for cooking and desserts.", price: 3.29, image: img("photo-1571212515416-515aab23f48b"), stock: 55, categoryId: dairy.id, unit: "200ml" },
    { name: "Fresh Spinach", slug: "fresh-spinach", description: "Tender, vibrant spinach leaves harvested fresh every morning.", price: 2.49, comparePrice: 3.5, image: img("photo-1576045057995-568f588f82fb"), stock: 150, categoryId: vegFruits.id, badge: "Organic", isFeatured: true, isTrending: true, unit: "250g" },
    { name: "Farm Carrots", slug: "farm-carrots", description: "Sweet, crunchy carrots freshly dug from local soil.", price: 1.99, image: img("photo-1445282768818-728615cc910a"), stock: 200, categoryId: vegFruits.id, isFeatured: true, unit: "500g" },
    { name: "Green Plant Bundle", slug: "green-plant-bundle", description: "A curated bundle of fresh green vegetables for your weekly needs.", price: 12.99, comparePrice: 16.0, image: img("photo-1540420773420-3366772f4999"), stock: 40, categoryId: vegFruits.id, badge: "Bundle", unit: "1kg" },
    { name: "Cherry Tomatoes", slug: "cherry-tomatoes", description: "Juicy, sun-ripened cherry tomatoes bursting with flavor.", price: 3.49, image: img("photo-1546470427-e262649c01a4"), stock: 120, categoryId: vegFruits.id, isTrending: true, unit: "300g" },
    { name: "Organic Broccoli", slug: "organic-broccoli", description: "Fresh organic broccoli, rich in vitamins and fiber.", price: 2.79, image: img("photo-1584270354949-4c1a17525784"), stock: 90, categoryId: vegFruits.id, badge: "Organic", unit: "400g" },
    { name: "Red Apples", slug: "red-apples", description: "Crisp, sweet-tart apples perfect for snacking or baking.", price: 4.99, comparePrice: 6.5, image: img("photo-1560806887-1e4cd0b6cbd6"), stock: 180, categoryId: vegFruits.id, isFeatured: true, unit: "1kg" },
    { name: "Himalayan Pink Salt", slug: "himalayan-pink-salt", description: "Pure Himalayan pink salt, rich in trace minerals.", price: 5.99, image: img("photo-1518110925495-5fe2fda0442c"), stock: 200, categoryId: spices.id, badge: "Premium", isFeatured: true, unit: "500g" },
    { name: "Turmeric Powder", slug: "turmeric-powder", description: "Golden turmeric with high curcumin content for health benefits.", price: 4.49, comparePrice: 6.0, image: img("photo-1596040033229-a9821ebd058d"), stock: 150, categoryId: spices.id, isTrending: true, unit: "200g" },
    { name: "Cumin Seeds", slug: "cumin-seeds", description: "Aromatic cumin seeds, essential for authentic cooking.", price: 3.29, image: img("photo-1481390939457-f626a3c1377c"), stock: 180, categoryId: spices.id, unit: "200g" },
    { name: "Red Chili Powder", slug: "red-chili-powder", description: "Vibrant red chili powder with a perfect heat level.", price: 3.99, image: img("photo-1582560475093-baacf0a60738"), stock: 160, categoryId: spices.id, unit: "200g" },
    { name: "Garam Masala Blend", slug: "garam-masala", description: "A perfectly balanced blend of warming spices.", price: 6.49, comparePrice: 8.0, image: img("photo-1506368085526-8faad8a8ea0d"), stock: 100, categoryId: spices.id, badge: "Bestseller", unit: "150g" },
    { name: "Organic Honey", slug: "organic-honey", description: "Raw, unfiltered honey harvested from local beehives.", price: 12.99, comparePrice: 16.0, image: img("photo-1587049352846-4a222e784d38"), stock: 75, categoryId: groceries.id, badge: "Raw", isFeatured: true, isTrending: true, unit: "500g" },
    { name: "Brown Rice", slug: "brown-rice", description: "Nutritious whole grain brown rice from organic farms.", price: 5.49, image: img("photo-1586201375761-83865001e31c"), stock: 250, categoryId: groceries.id, unit: "2kg" },
    { name: "Lentils Mix", slug: "lentils-mix", description: "A colorful mix of protein-rich lentils for wholesome meals.", price: 4.99, image: img("photo-1515543902-a1936d0120ee"), stock: 200, categoryId: groceries.id, unit: "1kg" },
    { name: "Sunflower Oil", slug: "sunflower-oil", description: "Cold-pressed sunflower oil, light and heart-healthy.", price: 7.99, comparePrice: 9.5, image: img("photo-1474979266404-7eaacbcd87c5"), stock: 120, categoryId: groceries.id, unit: "1L" },
    { name: "Spring Asparagus", slug: "spring-asparagus", description: "Tender asparagus spears, perfect for spring cooking.", price: 5.99, comparePrice: 7.5, image: img("photo-1515474470566-186d14bf0f88"), stock: 60, categoryId: seasonal.id, badge: "Seasonal", isTrending: true, unit: "500g" },
    { name: "Strawberries", slug: "strawberries", description: "Sweet, sun-kissed strawberries picked at peak ripeness.", price: 4.49, image: img("photo-1464965911861-ea96d398290b"), stock: 80, categoryId: seasonal.id, badge: "Seasonal", isFeatured: true, unit: "300g" },
    { name: "Pumpkin", slug: "pumpkin", description: "Rich, velvety pumpkin perfect for soups and pies.", price: 3.99, image: img("photo-1506917727837-7af06fbbbd73"), stock: 100, categoryId: seasonal.id, unit: "1kg" },
    { name: "Sweet Corn", slug: "sweet-corn", description: "Golden sweet corn, fresh from the field.", price: 2.99, image: img("photo-1601314007439-8a9c87743e8d"), stock: 150, categoryId: seasonal.id, isTrending: true, unit: "3 pcs" },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        image: product.image,
        farmerId: verifiedFarmer.id,
        price: product.price,
        comparePrice: product.comparePrice ?? null,
        stock: product.stock,
        isFeatured: product.isFeatured ?? false,
        isTrending: product.isTrending ?? false,
      },
      create: {
        ...product,
        farmerId: verifiedFarmer.id,
        images: "[]",
      },
    });
  }
  console.log(`✅ Upserted ${products.length} products (Unsplash images, farmer-owned)`);

  // Farmer stories
  const farmerStories = [
    {
      name: "Ram Bahadur Thapa",
      slug: "ram-bahadur-thapa",
      location: "Chitwan, Nepal",
      bio: "Ram has been farming organically for over 20 years in the fertile plains of Chitwan. His dedication to sustainable practices has helped him become one of the leading vegetable suppliers in the region.",
      avatar: "/assets/Homepage/profile.jpg",
      coverImage: "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg",
      joinedAt: new Date("2020-03-15"),
      farmSize: "5 hectares",
      speciality: "Organic Vegetables",
      yearsActive: 20,
    },
    {
      name: "Sita Devi Sharma",
      slug: "sita-devi-sharma",
      location: "Pokhara, Nepal",
      bio: "Sita runs a dairy farm that has been in her family for three generations. She specializes in artisan cheeses and organic dairy products that have won regional awards.",
      avatar: "/assets/Homepage/profile.jpg",
      coverImage: "/assets/Homepage/pexels-pixabay-533982.jpg",
      joinedAt: new Date("2021-06-01"),
      farmSize: "2 hectares",
      speciality: "Dairy & Cheese",
      yearsActive: 15,
    },
    {
      name: "Krishna Prasad Gautam",
      slug: "krishna-prasad-gautam",
      location: "Mustang, Nepal",
      bio: "Krishna cultivates rare Himalayan herbs and spices at high altitudes. His unique microclimate produces some of the most aromatic spices available in the market.",
      avatar: "/assets/Homepage/profile.jpg",
      coverImage: "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg",
      joinedAt: new Date("2022-01-10"),
      farmSize: "3 hectares",
      speciality: "Himalayan Spices",
      yearsActive: 12,
    },
  ];

  for (const story of farmerStories) {
    await prisma.farmerStory.upsert({
      where: { slug: story.slug },
      update: {},
      create: story,
    });
  }
  console.log("✅ Created farmer stories");

  // Sample blog posts
  const allProducts = await prisma.product.findMany({ take: 1 });
  const blogs = [
    {
      title: "10 Benefits of Eating Organic Vegetables",
      slug: "10-benefits-organic-vegetables",
      excerpt: "Discover why switching to organic vegetables can transform your health and wellbeing.",
      content: "# 10 Benefits of Eating Organic Vegetables\n\nOrganic vegetables are grown without synthetic pesticides and fertilizers...\n\n## 1. No Harmful Chemicals\n\nOrganic farming avoids synthetic pesticides that can be harmful to health...\n\n## 2. Higher Nutrient Content\n\nStudies show organic produce often contains higher levels of vitamins and minerals...",
      image: "/assets/Homepage/pexels-pixabay-533982.jpg",
      authorId: demoUser.id,
      published: true,
      publishedAt: new Date("2024-01-15"),
    },
    {
      title: "From Farm to Table: Our Journey",
      slug: "farm-to-table-journey",
      excerpt: "How we ensure the freshest produce reaches your doorstep within hours of harvest.",
      content: "# From Farm to Table: Our Journey\n\nAt Farm Commerce, we believe fresh food should be accessible to everyone...",
      image: "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg",
      authorId: demoUser.id,
      published: true,
      publishedAt: new Date("2024-02-20"),
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }
  console.log("✅ Created blog posts");

  // Sample reviews on featured products
  if (allProducts.length > 0) {
    const reviewData = [
      { rating: 5, comment: "Absolutely fresh and delicious! Will order again." },
      { rating: 4, comment: "Great quality, delivered on time." },
      { rating: 5, comment: "Best organic produce I've had!" },
    ];

    for (const [idx, review] of reviewData.entries()) {
      if (allProducts[idx]) {
        await prisma.review.upsert({
          where: { userId_productId: { userId: demoUser.id, productId: allProducts[0].id } },
          update: {},
          create: {
            userId: demoUser.id,
            productId: allProducts[0].id,
            ...review,
          },
        }).catch(() => {});
      }
    }
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
