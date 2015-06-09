class CarsController < ApplicationController

  def index
    @user = User.find(1)
    @cars = @user.cars
    @car = Car.new
  end

  def new
    @car = Car.new
    @user = User.find(1)
  end

  def create
    @car = Car.new(car_params)
    @car.user_id = 1
    if @car.save
      render @car
    else
      render json: { status: 'failure' }
    end
  end

  def show

  end

  def edit

  end

  def update

  end

  def destroy
    @car = User.find(1).cars.find(params[:id])
    @car.destroy
    render nothing: true
  end

  private

  def car_params
    params.require(:car).permit(:make, :model, :year, :style, :style_id, :model_year_id, :user_id, :mileage)
  end

end
