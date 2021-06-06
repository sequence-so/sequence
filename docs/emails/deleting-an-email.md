# Deleting an Email

### Deleting an Email

To delete an Email, click on the **Delete** button on the bottom right. Emails are soft deleted, which means they are still accessible via the database but aren't accessible via the UI. 

If you need to recover an email, you can set the emails `deletedAt` column to `null` via a database query. 

