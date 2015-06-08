class Car < ActiveRecord::Base

  belongs_to :user
  validates :make, :model, :style, :style_id, :zip, :model_year_id, :user_id, :mileage, presence: true

end
