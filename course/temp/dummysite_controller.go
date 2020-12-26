/*


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package controllers

import (
	"context"
	"fmt"
	"github.com/go-logr/logr"
	core "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"

	dummysitectrlv1 "dummysite-ctrl/api/v1"
)

// DummysiteReconciler reconciles a Dummysite object
type DummysiteReconciler struct {
	client.Client
	Log    logr.Logger
	Scheme *runtime.Scheme
}

// +kubebuilder:rbac:groups=dummysite-ctrl.--domain,resources=dummysites,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=dummysite-ctrl.--domain,resources=dummysites/status,verbs=get;update;patch

func constructPodForDummysite(dummysite *dummysitectrlv1.Dummysite, url string) *core.Pod {

	return &core.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      dummysite.Name,
			Namespace: dummysite.Namespace,
			Labels: map[string]string{
				"app": dummysite.Name,
			},
		},
		Spec: core.PodSpec{
			Containers: []core.Container{
				{
					Name:  dummysite.Name,
					Image: "juslesan/dummy",
					Args:  []string{dummysite.Spec.Url},
				},
			},
		},
	}
}

func (r *DummysiteReconciler) Reconcile(req ctrl.Request) (ctrl.Result, error) {
	ctx := context.Background()
	_ = r.Log.WithValues("dummysite", req.NamespacedName)

	var dummysite dummysitectrlv1.Dummysite

	job := constructPodForDummysite(&dummysite, dummysite.Spec.Url)

	if err := r.Create(ctx, job); err != nil {
		fmt.Println(err, "Unable to create a job")
		return ctrl.Result{}, err
	}


	return ctrl.Result{}, nil
}

func (r *DummysiteReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&dummysitectrlv1.Dummysite{}).
		Complete(r)
}
