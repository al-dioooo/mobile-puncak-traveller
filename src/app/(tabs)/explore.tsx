import { CommunityCard } from '@/components/puncak/cards';
import { AppScreen, StateBlock } from '@/components/puncak/ui';
import { useCommunities } from '@/hooks/use-puncak-api';
import { View } from '@/tw';

export default function ExploreScreen() {
  const communities = useCommunities({ per_page: 10 });

  if (communities.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading Explore Hub" message="Fetching community resources." />
      </AppScreen>
    );
  }

  if (communities.isError) {
    return (
      <AppScreen>
        <StateBlock
          title="Unable to load Explore"
          message="The backend did not return community resources."
          onRetry={() => communities.refetch()}
        />
      </AppScreen>
    );
  }

  const communityItems = communities.data?.data ?? [];

  return (
    <AppScreen contentClassName="items-center px-6 pb-28 pt-4">
      {communityItems.length ? (
        <View className="gap-4">
          {communityItems.map((community) => (
            <CommunityCard key={community.slug} community={community} />
          ))}
        </View>
      ) : (
        <StateBlock title="No communities returned" message="The backend returned an empty community list." />
      )}
    </AppScreen>
  );
}
