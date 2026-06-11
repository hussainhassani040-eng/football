import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
  const u = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Reporter',
    }
  })

  await prisma.article.createMany({
    data: [
      {
        title: 'Dramatic late winner secures derby victory',
        slug: 'dramatic-late-winner-derby',
        content: 'A full match report goes here...',
        excerpt: 'A stunning stoppage-time goal decided the derby as fans erupted.',
        publishedAt: new Date(),
        authorId: u.id
      },
      {
        title: 'Star striker signs new long-term contract',
        slug: 'star-striker-new-contract',
        content: 'Contract details and quotes...',
        excerpt: 'The club has confirmed the forward will stay for five more years.',
        publishedAt: new Date(),
        authorId: u.id
      }
    ],
    skipDuplicates: true
  })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
