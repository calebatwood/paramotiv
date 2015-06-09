class Car < ActiveRecord::Base

  belongs_to :user
  validates :make, :model, :style, :style_id, :model_year_id, :mileage, presence: true

end
