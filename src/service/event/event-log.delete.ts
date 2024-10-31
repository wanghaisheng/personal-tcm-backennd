import { InternalServerError } from '@/zodSchemas/InternalServerError'
import { createRoute, z } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema/event'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

const eventLogDelete = createRoute({
  method: 'delete',
  path: '/api/event-log/{id}',
  request: {
    params: z.object(
      {
        id: z.string().min(1).openapi({
          param: {
            in: 'path',
            name: 'id',
          },
          example: '1',
        }),
      },
    ),
  },
  responses: {
    204: {
      description: 'No Content',
    },
    500: InternalServerError,
  },
})

appServer.openapi(eventLogDelete, async (c) => {
  const { id } = c.req.valid('param')
  const db = drizzle(c.env.DB)
  await db
    .delete(eventLog)
    .where(eq(eventLog.id, Number(id)))
    .execute()

  return c.newResponse(null, 204)
})
