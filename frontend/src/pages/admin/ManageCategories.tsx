import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { categories as initialCategories, clothes } from '../../data/mockData';
import { toast } from 'sonner';
export function ManageCategories() {
  const [categories, setCategories] = useState(
    initialCategories.map((c, i) => ({
      id: `cat-${i}`,
      name: c
    }))
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const handleAdd = () => {
    if (!newCategory.trim()) return;
    setCategories([
    ...categories,
    {
      id: `cat-${Date.now()}`,
      name: newCategory.trim()
    }]
    );
    setNewCategory('');
    setIsAdding(false);
    toast.success('Category added');
  };
  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    setCategories(
      categories.map((c) =>
      c.id === id ?
      {
        ...c,
        name: editName.trim()
      } :
      c
      )
    );
    setEditingId(null);
    toast.success('Category updated');
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
      toast.success('Category deleted');
    }
  };
  const getCount = (catName: string) =>
  clothes.filter((c) => c.category === catName).length;
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif font-semibold text-warmGray-900">
          Product Categories
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-warmGray-50 text-warmGray-500 border-b border-warmGray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Category Name</th>
              <th className="px-6 py-4 font-medium">Items Count</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warmGray-100">
            {isAdding &&
            <tr className="bg-primary-50">
                <td className="px-6 py-4">
                  <input
                  type="text"
                  autoFocus
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name..."
                  className="w-full px-3 py-1.5 rounded-lg border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
                
                </td>
                <td className="px-6 py-4 text-warmGray-400">0</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                    onClick={handleAdd}
                    className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg">
                    
                      <Check size={18} />
                    </button>
                    <button
                    onClick={() => setIsAdding(false)}
                    className="p-1.5 text-warmGray-500 hover:bg-warmGray-200 rounded-lg">
                    
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            }

            {categories.map((cat) =>
            <tr
              key={cat.id}
              className="hover:bg-warmGray-50 transition-colors">
              
                <td className="px-6 py-4">
                  {editingId === cat.id ?
                <input
                  type="text"
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  onKeyDown={(e) =>
                  e.key === 'Enter' && handleSaveEdit(cat.id)
                  } /> :


                <span className="font-medium text-warmGray-900">
                      {cat.name}
                    </span>
                }
                </td>
                <td className="px-6 py-4 text-warmGray-600">
                  {getCount(cat.name)} items
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === cat.id ?
                  <>
                        <button
                      onClick={() => handleSaveEdit(cat.id)}
                      className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg">
                      
                          <Check size={18} />
                        </button>
                        <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-warmGray-500 hover:bg-warmGray-200 rounded-lg">
                      
                          <X size={18} />
                        </button>
                      </> :

                  <>
                        <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditName(cat.name);
                      }}
                      className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      
                          <Edit2 size={18} />
                        </button>
                        <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-warmGray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      
                          <Trash2 size={18} />
                        </button>
                      </>
                  }
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>);

}