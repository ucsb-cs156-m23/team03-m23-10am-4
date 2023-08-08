import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function MenuItemReviewEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: menuitemreview, error: _error, status: _status } =
    useBackend(
      [`/api/menuitemreview/${id}`],
      { method: "GET", url: `/api/menuitemreview/${id}` },
    );

    const objectToAxiosPutParams = (menuitemreview) => ({
      url: `/api/menuitemreview/${id}`,
      method: "put",
      data: {
        id: menuitemreview.id,
        itemId: menuitemreview.itemId,
        reviewerEmail: menuitemreview.reviewerEmail,
        stars: menuitemreview.stars,
        dateReviewed: menuitemreview.dateReviewed,
        comments: menuitemreview.comments,
      },
      });

      const onSuccess = (menuitemreview) => {
        toast(`MenuItemReview Updated - id: ${menuitemreview.id} itemId: ${menuitemreview.itemId} reviewerEmail: ${menuitemreview.reviewerEmail} stars: ${menuitemreview.stars} dateReviewed: ${menuitemreview.dateReviewed} comments: ${menuitemreview.comments}`);
      }

      const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/menuitemreview/${id}`]
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
            <h1>Edit MenuItemReview</h1>
            {
              menuitemreview && <MenuItemReviewForm submitAction={onSubmit} buttonLabel={"Update"} initialMenuItemReview={menuitemreview} />
            }
          </div>
        </BasicLayout>
      )
}
