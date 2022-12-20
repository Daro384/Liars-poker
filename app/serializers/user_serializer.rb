class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :rating, :display_name, :password
end
