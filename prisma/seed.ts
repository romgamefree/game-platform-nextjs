const { PrismaClient } = require("@prisma/client")
const { hash } = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Create categories
  const action = await prisma.category.upsert({
    where: { slug: "action" },
    update: {},
    create: {
      name: "Action Games",
      slug: "action",
      description: "Fast-paced action games",
      image: "/categories/action.jpg",
    },
  })

  const puzzle = await prisma.category.upsert({
    where: { slug: "puzzle" },
    update: {},
    create: {
      name: "Puzzle Games",
      slug: "puzzle",
      description: "Brain-teasing puzzle games",
      image: "/categories/puzzle.jpg",
    },
  })

  const strategy = await prisma.category.upsert({
    where: { slug: "strategy" },
    update: {},
    create: {
      name: "Strategy Games",
      slug: "strategy",
      description: "Strategic thinking games",
      image: "/categories/strategy.jpg",
    },
  })

  // Create sample games
  const games = [
    {
      title: "Space Adventure",
      slug: "space-adventure",
      description: "An exciting space exploration game",
      thumbnail: "/games/space-adventure.jpg",
      embedUrl: "https://example.com/games/space-adventure",
      categoryId: action.id,
      content: "Game content here...",
      published: true,
    },
    {
      title: "Brain Puzzle",
      slug: "brain-puzzle",
      description: "Challenge your mind with puzzles",
      thumbnail: "/games/brain-puzzle.jpg",
      embedUrl: "https://example.com/games/brain-puzzle",
      categoryId: puzzle.id,
      content: "Game content here...",
      published: true,
    },
    {
      title: "Empire Builder",
      slug: "empire-builder",
      description: "Build and manage your empire",
      thumbnail: "/games/empire-builder.jpg",
      embedUrl: "https://example.com/games/empire-builder",
      categoryId: strategy.id,
      content: "Game content here...",
      published: true,
    },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: game,
    })
  }

  // Create settings
  await prisma.setting.upsert({
    where: { key: "site_name" },
    update: {},
    create: {
      key: "site_name",
      value: "Game Platform",
    },
  })

  await prisma.setting.upsert({
    where: { key: "site_description" },
    update: {},
    create: {
      key: "site_description",
      value: "Your favorite online gaming platform",
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 