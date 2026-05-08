'use client';
import { ENDPOINTS } from '@/constants';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { CourseCard, SearchFilterBar, EmptyState, PageHeader } from '@/shared/components';

const CATEGORY_OPTIONS = [
  'BPSC Prelims', 'BPSC Mains', 'Current Affairs',
  'History', 'Geography', 'Polity', 'Economy', 'Science',
].map(c => ({ label: c, value: c }));

const PRICE_OPTIONS = [
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
];

export default function CoursesPage() {
  const [courses, setCourses]         = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    fetch(ENDPOINTS.COURSES.LIST)
      .then(r => r.json())
      .then(d => { setCourses(d.courses || []); setFiltered(d.courses || []); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = courses;
    if (search)                result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.shortDesc?.toLowerCase().includes(search.toLowerCase()));
    if (category)              result = result.filter(c => c.category === category);
    if (priceFilter === 'free') result = result.filter(c => c.isFree);
    if (priceFilter === 'paid') result = result.filter(c => !c.isFree);
    setFiltered(result);
  }, [search, category, priceFilter, courses]);

  const clearFilters = () => { setSearch(''); setCategory(''); setPriceFilter(''); };
  const hasFilters   = !!(search || category || priceFilter);

  return (
    <div>
      <PageHeader variant="hero" title="All Courses" subtitle="Choose your path to BPSC success" />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search courses..."
        selects={[
          { value: category,    onChange: setCategory,    placeholder: 'All Categories', options: CATEGORY_OPTIONS },
          { value: priceFilter, onChange: setPriceFilter, placeholder: 'All Prices',     options: PRICE_OPTIONS },
        ]}
        hasFilters={hasFilters}
        onClear={clearFilters}
      />

      <p className="text-gray-500 text-sm mb-6">
        <span className="font-bold text-gray-900">{filtered.length}</span> courses found
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse"/>)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={48}/>}
          title="No courses found"
          description="Try adjusting your search or filters."
          action={<button onClick={clearFilters} className="text-blue-600 font-semibold hover:underline text-sm">Clear all filters</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => <CourseCard key={c._id} course={c} />)}
        </div>
      )}
    </div>
  );
}
