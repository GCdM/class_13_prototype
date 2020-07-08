class CreatePrompts < ActiveRecord::Migration[6.0]
  def change
    create_table :prompts do |t|
      t.string :content
      t.integer :duration

      t.timestamps
    end
  end
end
