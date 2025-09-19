import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

const investmentSchema = z.object({
  name: z.string().min(1, 'Investment name is required'),
  difficulty: z.enum(['high','medium','low'], {
    errorMap: () => ({ message: 'Please select a difficulty level' }),
  }),

  tags: z.string().min(1, 'Tags are required').transform(val => 
    val.split(',').map(tag => tag.trim())
  ),

  tenure_months: z.number({ invalid_type_error: 'Tenure is required' }).positive('Tenure must be a positive number'),
  annual_yield: z.number({ invalid_type_error: 'Annual yield is required' }).positive('Annual yield must be a positive number'),
  min_investment: z.number({ invalid_type_error: 'Minimum investment is required' }).positive('Minimum investment must be a positive number'),
  description: z.string().min(1, 'Description is required'),
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(investmentSchema),
  });

  const onSubmit = async (data) => {
   
    console.log('Submitting data:', data); 
    try {
     
      await axiosClient.post('/product/create', data); 
      alert('Investment created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submission failed:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Investment</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                {...register('name')}
                className={`input input-bordered ${errors.name && 'input-error'}`}
              />
              {errors.name && (
                <span className="text-error">{errors.name.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Difficulty</span>
              </label>
              <select
                {...register('difficulty')}
                className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                defaultValue=""
              >
                <option disabled value="">Select difficulty</option>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
              {errors.difficulty && (
                <span className="text-error">{errors.difficulty.message}</span>
              )}
            </div>
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Tags (comma-separated)</span>
              </label>
              <input
                {...register('tags')}
                placeholder="e.g., Real Estate, Tech, Green Energy"
                className={`input input-bordered ${errors.tags && 'input-error'}`}
              />
              {errors.tags && (
                <span className="text-error">{errors.tags.message}</span>
              )}
            </div>

          
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tenure (Months)</span>
              </label>
              <input
                type="number"
                {...register('tenure_months', { valueAsNumber: true })}
                className={`input input-bordered ${errors.tenure_months && 'input-error'}`}
              />
              {errors.tenure_months && (
                <span className="text-error">{errors.tenure_months.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Annual Yield (%)</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('annual_yield', { valueAsNumber: true })}
                className={`input input-bordered ${errors.annual_yield && 'input-error'}`}
              />
              {errors.annual_yield && (
                <span className="text-error">{errors.annual_yield.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Minimum Investment</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('min_investment', { valueAsNumber: true })}
                className={`input input-bordered ${errors.min_investment && 'input-error'}`}
              />
              {errors.min_investment && (
                <span className="text-error">{errors.min_investment.message}</span>
              )}
            </div>
            
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered h-24 ${errors.description && 'textarea-error'}`}
              ></textarea>
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Create Investment
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;