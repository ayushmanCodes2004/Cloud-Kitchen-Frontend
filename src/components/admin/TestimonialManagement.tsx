import { useState, useEffect } from 'react';
import { testimonialApi, TestimonialResponse } from '@/services/testimonialApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Check, X, Quote } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const TestimonialManagement = () => {
  const { toast } = useToast();
  const [pendingTestimonials, setPendingTestimonials] = useState<TestimonialResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPendingTestimonials = async () => {
    try {
      const testimonials = await testimonialApi.getPendingTestimonials();
      setPendingTestimonials(testimonials);
    } catch (error) {
      console.error('Failed to load pending testimonials:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pending testimonials"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingTestimonials();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await testimonialApi.approveTestimonial(id);
      toast({
        title: "✅ Approved",
        description: "Testimonial has been approved and will appear on the landing page"
      });
      setPendingTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve testimonial"
      });
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this testimonial? It will be permanently deleted.')) {
      return;
    }

    try {
      await testimonialApi.rejectTestimonial(id);
      toast({
        title: "Rejected",
        description: "Testimonial has been rejected and deleted"
      });
      setPendingTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject testimonial"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading pending testimonials...</p>
      </div>
    );
  }

  if (pendingTestimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No pending testimonials</p>
        <p className="text-gray-500 text-sm mt-2">All testimonials have been reviewed</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pending Testimonials</h2>
        <p className="text-gray-600">Review and approve testimonials from students and chefs</p>
      </div>

      <div className="grid gap-6">
        {pendingTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {testimonial.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{testimonial.userName}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {testimonial.userRole === 'STUDENT' 
                        ? `👨‍🎓 ${testimonial.institution || 'Student'}` 
                        : '👨‍🍳 Chef'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm font-medium text-gray-700 ml-2">{testimonial.rating}/5</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Quote className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleApprove(testimonial.id)}
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 font-medium"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(testimonial.id)}
                  variant="destructive"
                  className="flex items-center gap-2 font-medium"
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
                <p className="text-xs text-gray-500 ml-auto">
                  Submitted on {new Date(testimonial.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
