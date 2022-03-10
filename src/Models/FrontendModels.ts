import { MediaType } from './BackendModels';

export interface RecommendedItem {
  id: number;
  //index: number;
  mediaType: MediaType;
  title: string;
  releaseDate: string;
  posterUrl: string | null;
  userComment: string;
  userRating: number | null;
}

export interface RecommendationListDetails {
  title: string;
  description?: string;
}

export interface CreateRecommendationList {
  listName: string;
  listDescription?: string;
  list: CreateRecommendationListItem[];
}

export interface CreateRecommendationListItem {
  tmdbId: number;
  index: number;
  mediaType: MediaType;
  userComment?: string;
  userRating?: number | null;
}

/*
data class CreateListRequestModel(
    val listName: String?,
    val listDescription: String?,
    val list: List<RecommendedMedia>
    //val listId: String set when creating db id?
    //val createdBy: String? - probably not needed, but maybe some people want to set creator name
    //val adminId: UUID // backend - not sent to frontend
)

data class RecommendedMedia (
    val itemIndex: Int,
    val mediaType: MediaType,
    val tmdbId: Int,
    val title: String,
    val userRating: Int? = null,
    val userComment: String? = null,
    val originalTitle: String? = null,
    //val posterUrl: String, // get from backend
    //val imdbUrl: String, // backend
    //val genres: List<String> backend
)


 */
