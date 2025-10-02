class ItemsController < ApplicationController

  def index
  end

  def new
  end

  private
  def tweet_params
    params.require(:tweet).permit(:name, :image, :text)
  end

end
