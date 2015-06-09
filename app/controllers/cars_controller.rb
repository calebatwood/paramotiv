class CarsController < ApplicationController

  def index
    @cars = Car.all
    @car = Car.new
  end

  def new
    @car = Car.new

  end

  def create
    @car = Car.new(car_params)
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
    @car = Car.find(params[:id])
    @car.destroy
    render nothing: true
  end

  private

  def car_params
    params.require(:car).permit(:make, :model, :year, :style, :style_id, :model_year_id, :mileage)
  end

end
