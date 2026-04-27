import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LeftIcon } from '../icons';
import { formatRelative } from 'date-fns';
import { NavLink } from 'react-router';

const AllFriendActivities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const friendActivities = location.state?.friendActivities || [];

  return (
    <div className="min-h-screen bg-base-200 pb-10">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md z-30 border-b border-gray-100">
        <div className="px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-gray-100 rounded-full active:scale-90 transition-all"
          >
            <LeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Friends Activities</h1>
        </div>
      </div>

      <div className="pt-24 px-6">
        <div className="flex flex-col gap-3 w-full">
          {friendActivities?.length > 0 ? (
            friendActivities.map((item) => (
              <NavLink to={`/activity-details?actid=${item?.activityId}`} key={item?.id}>
                <div className="bg-white p-4 rounded-[20px] flex items-center gap-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                    <img 
                      src={item?.user?.profileImg || '/assets/default-profilepic.jpg'} 
                      className="w-full h-full object-cover" 
                      onError={(e) => e.target.src = '/assets/default-profilepic.jpg'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium mb-1 truncate">
                      <span className="font-bold">{item?.user?.username || 'Someone'} </span>
                      <span>is {item?.action || 'doing something'}</span>
                      <span className='text-[#6e2f12] font-semibold'> {item?.activityTitle || 'an activity'}</span>
                    </p>
                    <p className='text-[10px] text-gray-400'>
                      {item?.createdAt ? formatRelative(new Date(item.createdAt), new Date()) : 'recently'}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-2xl px-3 py-1 text-[12px] font-bold text-[#6e2f12] shrink-0">
                    View
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400 italic">
              No friend activities found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFriendActivities;
