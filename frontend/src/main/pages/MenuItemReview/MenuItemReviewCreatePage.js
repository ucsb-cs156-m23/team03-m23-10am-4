import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({storybook=false}) {

  /*
  {
  "itemId": 0,
  "reviewerEmail": "string",
  "stars": 0,
  "dateReviewed": "2023-08-08T23:42:03.345Z",
  "comments": "string",
  "id": 0
  }
  */
  const objectToAxiosParams = (menuitemreview) => ({
    url: "/api/menuitemreview/post",
    method: "POST",
    params: {
      itemId: menuitemreview.itemId,
      reviewerEmail: menuitemreview.reviewerEmail,
      stars: menuitemreview.stars,
      dateReviewed: menuitemreview.dateReviewed,
      comments: menuitemreview.comments,
    }
  });

  const onSuccess = (menuitemreview) => {
    toast(`New MenuItemReview Created - id: ${menuitemreview.id} itemId: ${menuitemreview.itemId} reviewerEmail: ${menuitemreview.reviewerEmail} stars: ${menuitemreview.stars} dateReviewed: ${menuitemreview.dateReviewed} comments: ${menuitemreview.comments}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/menuitemreview/all"] // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (menuitemreview) => {
    mutation.mutate(menuitemreview);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New MenuItemReview</h1>
        <MenuItemReviewForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
