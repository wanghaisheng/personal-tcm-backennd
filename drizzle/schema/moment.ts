import { upload } from '~drizzle/schema/upload'
import { relations } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const moment = sqliteTable('moment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').default('moment').notNull(),
  content: text('content').default('').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const momentsToUploads = sqliteTable('moments_to_uploads', {
  momentId: integer('moment_id').notNull().references(() => moment.id),
  uploadId: integer('upload_id').notNull().references(() => upload.id),
  sort: integer('sort').notNull().default(0),
  order: integer('order').notNull().default(0),
}, (t) => {
  return {
    pk: primaryKey({
      columns: [t.momentId, t.uploadId],
    }),
  }
})

export const momentRelations = relations(moment, ({ many }) => {
  return {
    attachments: many(upload),
  }
})

export const momentToUploadRelations = relations(momentsToUploads, ({ one }) => {
  return {
    moment: one(moment),
    upload: one(upload),
  }
})
