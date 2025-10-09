require 'rails_helper'

RSpec.describe Item, type: :model do
  before do
    @item = FactoryBot.build(:item)
  end

  describe '商品出品機能' do
 
    context '出品できるとき' do
      it 'すべての項目が正しく入力されていれば出品できる' do
        expect(@item).to be_valid
      end
    end

    context '出品できないとき' do
      it '画像が空では出品できない' do
        @item.image = nil
        @item.valid?
        expect(@item.errors.full_messages).to include('Image を添付してください')
      end

      it '商品名が空では出品できない' do
        @item.product = ''
        @item.valid?
        expect(@item.errors.full_messages).to include("Product can't be blank")
      end

      it '商品説明が空では出品できない' do
        @item.introduce = ''
        @item.valid?
        expect(@item.errors.full_messages).to include("Introduce can't be blank")
      end

      it 'カテゴリーが「---」では出品できない' do
        @item.category_id = 1
        @item.valid?
        expect(@item.errors.full_messages).to include("Category can't be blank")
      end

      it '商品の状態が「---」では出品できない' do
        @item.condition_id = 1
        @item.valid?
        expect(@item.errors.full_messages).to include("Condition can't be blank")
      end

      it '配送料の負担が「---」では出品できない' do
        @item.shipping_cost_id = 1
        @item.valid?
        expect(@item.errors.full_messages).to include("Shipping cost can't be blank")
      end

      it '発送元の地域が「---」では出品できない' do
        @item.prefecture_id = 1
        @item.valid?
        expect(@item.errors.full_messages).to include("Prefecture can't be blank")
      end

      it '発送までの日数が「---」では出品できない' do
        @item.shipping_date_id = 1
        @item.valid?
        expect(@item.errors.full_messages).to include("Shipping date can't be blank")
      end

      it '価格が空では出品できない' do
        @item.price = ''
        @item.valid?
        expect(@item.errors.full_messages).to include("Price can't be blank")
      end

      it '価格が300未満では出品できない' do
        @item.price = 299
        @item.valid?
        expect(@item.errors.full_messages).to include('Price は¥300〜¥9,999,999の範囲で入力してください')
      end

      it '価格が9,999,999を超えると出品できない' do
        @item.price = 10_000_000
        @item.valid?
        expect(@item.errors.full_messages).to include('Price は¥300〜¥9,999,999の範囲で入力してください')
      end

      it '価格が半角数字以外では出品できない（全角数字）' do
        @item.price = '５００'
        @item.valid?
        expect(@item.errors.full_messages).to include('Price は¥300〜¥9,999,999の範囲で入力してください')
      end      

      it '価格が文字混在では出品できない（例: 1000yen）' do
        @item.price = '1000yen'
        @item.valid?
        expect(@item.errors.full_messages).to include('Price は¥300〜¥9,999,999の範囲で入力してください')
      end

      it 'ユーザーが紐付いていないと出品できない' do
        @item.user = nil
        @item.valid?
        expect(@item.errors.full_messages).to include('User must exist')
      end
    end
  end
end
