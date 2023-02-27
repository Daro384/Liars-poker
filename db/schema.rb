# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_02_26_093241) do
  create_table "games", force: :cascade do |t|
    t.string "lobby_name"
    t.boolean "ongoing"
    t.string "rng_hash"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "host_id"
  end

  create_table "hosts", force: :cascade do |t|
    t.integer "player_id"
    t.string "lobby_name"
    t.string "rng_seed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "moves", force: :cascade do |t|
    t.integer "game_id"
    t.integer "player_id"
    t.string "hand"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "participants", force: :cascade do |t|
    t.integer "host_id"
    t.integer "player_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "display_name"
  end

  create_table "players", force: :cascade do |t|
    t.integer "game_id"
    t.integer "player_id"
    t.string "display_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.string "display_name"
    t.integer "rating"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
