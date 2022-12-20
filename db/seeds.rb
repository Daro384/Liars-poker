puts "destroying previous data"
    User.destroy_all

puts "seeding data"
joseph = User.create(display_name:"Joseph", username:"daro1", password:"1234", rating:1200)
#   Character.create(name: "Luke", movie: movies.first)

puts "Done Seeding Data"
