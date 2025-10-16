FactoryBot.define do
  factory :order_address do
    post_code      { '123-4567' }
    prefecture_id  { 2 }
    city           { '渋谷区' }
    street         { '道玄坂1-1-1' }
    building       { 'ヒカリエ12F' }
    phone_number   { '09012345678' }
    token          { 'tok_abcdefghijk00000000000000000' }
  end
end
