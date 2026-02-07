import React, { useState, useEffect, useRef } from 'react';
import { Product, Vendor, User, Review } from '../types';
import { ArrowLeft, Star, ShieldCheck, Truck, ChevronLeft, ChevronRight, Check, Heart, AlertTriangle, MessageSquare } from 'lucide-react';
import { fetchProduct, fetchVendor, fetchUserByVendorId, fetchReviewsByProduct, submitReview, startConversation } from '../api/api';
import { navigate, useParams } from '../router';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useLikes } from '../hooks/useLikes';
import { StarRating } from '../components/StarRating';

export const ProductDetailsPage: React.FC = () => {
  const { id: productId } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isLiked, addToLikes, removeFromLikes } = useLikes();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [vendorUser, setVendorUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const addedTimeoutRef = useRef<number | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // State for new review form
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    return () => { if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current); };
  }, []);

  useEffect(() => {
    if (!productId) {
      setError("Product not found.");
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [fetchedProduct, fetchedReviews] = await Promise.all([
          fetchProduct(productId),
          fetchReviewsByProduct(productId)
        ]);
        
        setProduct(fetchedProduct);
        setReviews(fetchedReviews);
        setCurrentImageIndex(0);
        
        if (fetchedProduct.vendorId) {
          const [fetchedVendor, fetchedVendorUser] = await Promise.all([
            fetchVendor(fetchedProduct.vendorId),
            fetchUserByVendorId(fetchedProduct.vendorId)
          ]);
          setVendor(fetchedVendor);
          setVendorUser(fetchedVendorUser);
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setValidationError('Please select a size to continue.');
        return;
    }
    addToCart(product, selectedSize || undefined);
    setIsAdded(true);
    if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = window.setTimeout(() => setIsAdded(false), 1500);
  };

  const handleMessageSeller = async () => {
    if (!user || !product) {
        navigate('/login');
        return;
    }
    try {
        const conversationId = await startConversation(product.id, user.id);
        navigate(`/conversations/${conversationId}`);
    } catch (error) {
        console.error("Failed to start conversation:", error);
        alert("Could not start a conversation. Please try again later.");
    }
  };
  
  const nextImage = () => product && setCurrentImageIndex(prev => (prev + 1) % product.imageUrls.length);
  const prevImage = () => product && setCurrentImageIndex(prev => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);

  const liked = product ? isLiked(product.id) : false;
  const handleLikeToggle = () => {
    if (!product) return;
    if (!user) { navigate('/login'); return; }
    if (liked) { removeFromLikes(product.id); } 
    else { addToLikes(product); }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    if (!product || !user || newReviewRating === 0 || !newReviewComment.trim()) {
      setReviewError("Please provide a rating and a comment to submit your review.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const submittedReview = await submitReview(product.id, user.id, user.name, newReviewRating, newReviewComment);
      setReviews(prev => [submittedReview, ...prev]);
      setNewReviewComment('');
      setNewReviewRating(0);
    } catch (error) {
      setReviewError("There was an error submitting your review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-20 flex flex-col items-center gap-4">
        <p className="text-red-500">{message}</p>
        <button onClick={() => navigate('/')} className="flex items-center text-sm font-medium bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to browse
        </button>
    </div>
  );

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <ErrorDisplay message={error} />;
  if (!product) return <ErrorDisplay message="Product could not be found." />;
  
  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
  const canAddToCart = !(product.sizes && product.sizes.length > 0 && !selectedSize);

  return (
    <>
    <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-8 bg-white md:bg-transparent min-h-screen">
      <div className="flex flex-col md:flex-row gap-0 md:gap-8 bg-white md:rounded-2xl overflow-hidden md:shadow-lg md:border border-neutral-200/50 md:mt-4 md:p-6">
        
        <div className="absolute top-4 left-4 z-10 md:hidden">
          <button onClick={() => navigate('/')} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white"><ArrowLeft className="w-5 h-5 text-neutral-800" /></button>
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5">
          <div className="bg-neutral-100 aspect-square md:rounded-xl overflow-hidden relative group">
            <img src={product.imageUrls[currentImageIndex]} alt={product.title} className="w-full h-full object-cover transition-opacity duration-300" key={currentImageIndex} />
            {product.imageUrls.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-white"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-white"><ChevronRight className="w-6 h-6" /></button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.imageUrls.map((_, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2.5 h-2.5 rounded-full ${currentImageIndex === index ? 'bg-white scale-110' : 'bg-white/50'} transition-all`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-5 md:p-0 md:w-1/2 lg:w-2/5 flex flex-col">
          <div className="hidden md:block mb-4"><button onClick={() => navigate('/')} className="text-neutral-500 hover:text-neutral-900 flex items-center text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-1.5" /> Back to browse</button></div>
          <div className="mb-2"><span className="text-primary-600 text-sm font-semibold tracking-wide uppercase">{product.category}</span></div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">{product.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2"><StarRating rating={averageRating} /><span className="text-sm text-neutral-600">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span></div>
            {product.condition && <span className="bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded text-xs font-medium border border-neutral-200">{product.condition}</span>}
          </div>
          <span className="text-3xl font-bold text-neutral-900 mb-6 block">P {product.price.toFixed(2)}</span>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
                <p className="text-sm font-medium text-neutral-900 mb-2">Select Size:</p>
                <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                        <button key={size} onClick={() => { setSelectedSize(size); setValidationError(null); }}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${selectedSize === size ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'}`}>
                            {size}
                        </button>
                    ))}
                </div>
            </div>
          )}
          
          {validationError && <div className="flex items-start gap-2 text-xs text-red-600 mb-4 p-2 bg-red-50 rounded-md border border-red-200"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{validationError}</span></div>}

          <div className="grid grid-cols-1 gap-3 mb-8">
            <button onClick={handleMessageSeller} className="w-full bg-neutral-900 text-white py-3.5 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition hover:bg-neutral-800"><MessageSquare className="w-5 h-5" /> Message Seller</button>
            <div className="grid grid-cols-5 gap-3">
              <button onClick={handleAddToCart} disabled={!canAddToCart || product.stock === 0 || isAdded}
                className={`col-span-4 text-white py-3.5 px-6 rounded-full font-semibold transition flex items-center justify-center gap-2 active:scale-95 duration-300 ${isAdded ? 'bg-green-600' : 'bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-200'} disabled:bg-neutral-300 disabled:shadow-none disabled:cursor-not-allowed`}>
                {product.stock === 0 ? 'Sold Out' : isAdded ? <><Check className="w-5 h-5" /> Added</> : 'Add to Bag'}
              </button>
              <button onClick={handleLikeToggle} className="col-span-1 flex items-center justify-center bg-neutral-100 rounded-full hover:bg-neutral-200 transition-transform active:scale-110" aria-label="Toggle like">
                  <Heart className={`w-6 h-6 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-neutral-700'}`} />
              </button>
            </div>
          </div>

          <div className="mb-8 border-t border-neutral-100 pt-6"><h3 className="font-semibold text-neutral-900 mb-2">Description</h3><p className="text-neutral-600 leading-relaxed text-sm md:text-base">{product.description}</p></div>

          {vendor && (
            <div onClick={() => navigate(`/sellers/${vendor.id}`)} className="mt-auto bg-neutral-100 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-neutral-200 transition border border-neutral-200/80">
              <img src={vendor.imageUrl} alt={vendor.name} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5"><h4 className="font-semibold text-neutral-900">{vendor.name}</h4>{vendor.verified && <ShieldCheck className="w-4 h-4 text-primary-500" />}</div>
                <div className="flex items-center text-sm text-neutral-600"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" /><span>{vendor.rating}</span><span className="mx-1.5">•</span><span>{vendor.location}</span></div>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500"><Truck className="w-4 h-4" /><span>Motorcycle delivery available (1-2 hours within Gabs)</span></div>
        </div>
      </div>
    </div>
    
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200/80">
            <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
            {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <h3 className="font-semibold mb-2">Leave a Review</h3>
                    {reviewError && <div className="flex items-start gap-2 text-xs text-red-600 mb-3 p-2 bg-red-50 rounded-md border border-red-200"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{reviewError}</span></div>}
                    <StarRating rating={newReviewRating} onRatingChange={setNewReviewRating} isInteractive />
                    <textarea value={newReviewComment} onChange={(e) => setNewReviewComment(e.target.value)} placeholder="Share your thoughts on this product..." className="w-full mt-3 border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition" rows={3} />
                    <div className="text-right mt-2"><button type="submit" disabled={isSubmittingReview} className="bg-neutral-900 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-neutral-800 disabled:opacity-70">{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</button></div>
                </form>
            ) : <div className="mb-8 p-4 text-center bg-neutral-50 rounded-lg border border-neutral-200 text-sm"><p>You must be <button onClick={() => navigate('/login')} className="font-semibold text-primary-600 hover:underline">logged in</button> to leave a review.</p></div>}
            
            <div className="space-y-6">
                {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="flex gap-4 border-t border-neutral-100 pt-6 first:border-t-0 first:pt-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700 flex-shrink-0">{review.userName.charAt(0)}</div>
                        <div>
                            <div className="flex items-center gap-3"><h4 className="font-semibold">{review.userName}</h4><span className="text-xs text-neutral-400">{new Date(review.date).toLocaleDateString()}</span></div>
                            <StarRating rating={review.rating} size={16} className="my-1.5" />
                            <p className="text-neutral-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    </div>
                )) : <p className="text-neutral-500 text-center py-8">No reviews yet. Be the first to share your thoughts!</p>}
            </div>
        </div>
    </div>
    </>
  );
};