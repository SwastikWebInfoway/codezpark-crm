Database migration command 

Create new table : npx sequelize-cli migration:generate --name create-tokens-table
Run Migration : npx sequelize-cli db:migrate

Table modifications : npx sequelize-cli migration:generate --name add-column-to-users

npx sequelize-cli db:migrate:undo:all
npx sequelize-cli migration:generate --name add-company-id-to-users
